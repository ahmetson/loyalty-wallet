import type { CredentialRequest, EthStateStorage, IProofService, W3CCredential, ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'
import { CircuitId, CredentialStatusType, ProofService, core } from '@0xpolygonid/js-sdk'
import { Contract, InfuraProvider, JsonRpcProvider, Network, Wallet, ZeroHash, randomBytes } from 'ethers'
import { abi } from '~/lib/abi'
import { CircuitStorageInstance } from '~/lib/circuit-storage.service'
import { IdentityServices } from '~/lib/identity.service'
import { PolygonIdService } from '~/lib/polygon-id.service'
import type { Account } from '~/types/account'

export default () => {
  const config = useRuntimeConfig()

  const accounts = useLocalStorage<Account[]>('accounts', [])
  const currentAccount = reactive<Account>(accounts.value.filter(v => v.isActive === true)[0])
  const credentials = ref<W3CCredential[]>([])
  const issuers = useLocalStorage<Account[]>('issuers', [])
  const progress = ref(CircuitStorageInstance.progress)

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

    try {
      const res = await idWallet?.addCredentialsToMerkleTree(
        [credential],
        new core.DID(issuerDID),
      )

      if (!res || !res.oldTreeState)
        throw new Error('Cannot add to MerkleTree')

      await idWallet?.publishStateToRHS(issuerDID, config.public.RHS_URL)

      // wallet.value.connect()
      const jsonRpc = (dataStorage?.states as EthStateStorage).provider

      if (!wallet || !wallet.mnemonic)
        throw new Error('No wallet')

      const signer = wallet.connect(jsonRpc)

      const txId = await proofService!.transitState(
        issuerDID,
        res.oldTreeState,
        true,
        dataStorage!.states,
        signer,
      )
      console.log(txId)
    }
    catch (e) {
      console.log(e)
    }

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
          birthday: {
            $lt: 20050101,
          },
        },
      },
    }

    const proof = await proofService!.generateProof(proofReqSig, new core.DID(currentAccount.did))

    const sigProofOk = await proofService!.verifyProof(
      proof,
      CircuitId.AtomicQuerySigV2, // or CircuitId.AtomicQueryMTPV2
    )

    return {
      proof,
      sigProofOk,
    }
  }

  async function deleteCredential(credential: W3CCredential) {
    const { credWallet } = PolygonIdService.getExtensionServiceInstance()

    credWallet?.remove(credential.id)

    await updateCredentials()
  }

  async function updateCredentials() {
    if (currentAccount) {
      const { credWallet } = await PolygonIdService.getExtensionServiceInstance()

      credentials.value = await credWallet!.filterByCredentialSubject(await credWallet!.list(), new core.DID(currentAccount.did))
    }
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
    progress,

    issueCredentials,
    deleteCredential,
    generateProof,
  }
}
