import type { CredentialRequest, EthStateStorage, IProofService, W3CCredential, ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'
import { CircuitId, CredentialStatusType, ProofService, core } from '@0xpolygonid/js-sdk'
import { Contract, InfuraProvider, JsonRpcProvider, Network, Wallet, ZeroHash } from 'ethers'
import { abi } from '~/lib/abi'
import { IdentityServices } from '~/lib/identity.service'
import { PolygonIdService } from '~/lib/polygon-id.service'
import type { Account } from '~/types/account'

export default () => {
  const config = useRuntimeConfig()

  const accounts = useLocalStorage<Account[]>('accounts', [])
  const currentAccount = reactive<Account>(accounts.value.filter(v => v.isActive === true)[0])
  const credentials = ref<W3CCredential[]>([])
  const issuers = useLocalStorage<Account[]>('issuers', [])

  const { wallet } = useWallet()

  async function issueCredentials(account: Account) {
    const { wallet: idWallet, credWallet, dataStorage } = PolygonIdService.getExtensionServiceInstance()
    const { did: issuerDID } = await IdentityServices.createIdentity()

    issuers.value.push({ name: 'Issuer', did: issuerDID, isActive: false })

    const claimReq: CredentialRequest = {
      credentialSchema:
	'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v2.json',
      type: 'KYCAgeCredential',
      credentialSubject: {
        id: new core.DID(account.did).string(),
        birthday: 19960424,
        documentType: 99,
      },
      expiration: 1893526400,
      revocationOpts: {
        type: CredentialStatusType.Iden3ReverseSparseMerkleTreeProof,
        id: config.public.RHS_URL,
      },
    }

    const issuerCred = await idWallet?.issueCredential(issuerDID, claimReq)

    if (issuerCred && dataStorage)
      await credWallet?.save(issuerCred)

    await updateCredentials()
  }

  async function generateProof(credential: W3CCredential, issuerDID: core.DID) {
    const { wallet: idWallet, dataStorage, proofService } = PolygonIdService.getExtensionServiceInstance()
    const res = await idWallet?.addCredentialsToMerkleTree(
      [credential],
      issuerDID,
    )

    console.log(issuerDID)
    await idWallet?.publishStateToRHS(issuerDID, config.public.RHS_URL)

    // wallet.value.connect()
    const jsonRpc = (dataStorage?.states as EthStateStorage).provider

    if (!wallet.value)
      throw new Error('No wallet')

    console.log(wallet.value, typeof wallet.value)

    const signer = Wallet.fromPhrase(wallet.value.mnemonic.phrase).connect(jsonRpc)
    console.log(signer)

    if (res && res.oldTreeState) {
      const txId = await proofService!.transitState(
        issuerDID,
        res.oldTreeState,
        true,
        dataStorage!.states,
        signer,
      )

      console.log(txId)

      const proofReqSig: ZeroKnowledgeProofRequest = {
        id: 1,
        circuitId: CircuitId.AtomicQuerySigV2,
        optional: false,
        query: {
          allowedIssuers: ['*'],
          type: credential.credentialSubject.type,
          context:
          'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
          credentialSubject: {
            documentType: {
              $eq: 99,
            },
          },
        },
      }

      const { proof, vp } = await proofService!.generateProof(proofReqSig, new core.DID(currentAccount.did))

      const ethSigner = Wallet.fromPhrase(wallet.value.mnemonic.phrase).connect(new JsonRpcProvider(config.public.ETH_RPC_URL))

      const contract = new Contract('0xb5b9ae9e80bddaa7477eb06785295123a8bdb2cd', abi, ethSigner)
      const result = await contract.submitPersonalData('0xb5b9ae9e80bddaa7477eb06785295123a8bdb2cd', ZeroHash, JSON.stringify(proof))
      console.log(result)
    }
  }

  async function deleteCredential(credential: W3CCredential) {
    const { credWallet } = PolygonIdService.getExtensionServiceInstance()

    credWallet?.remove(credential.id)

    await updateCredentials()
  }

  async function updateCredentials() {
    const { credWallet } = await PolygonIdService.getExtensionServiceInstance()
    credentials.value = await credWallet!.filterByCredentialSubject(await credWallet!.list(), new core.DID(currentAccount.did))
  }

  onMounted(async () => {
    if (!PolygonIdService.instancePS)
      await PolygonIdService.init()

    await updateCredentials()
  })

  return {
    currentAccount,
    accounts,
    issuers,
    credentials,

    issueCredentials,
    deleteCredential,
    generateProof,
  }
}
