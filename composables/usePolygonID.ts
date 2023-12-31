import type { CredentialRequest, EthStateStorage, W3CCredential, ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'
import { CircuitId, core } from '@0xpolygonid/js-sdk'
import { CircuitStorageInstance } from '~/lib/circuit-storage.service'
import { IdentityServices } from '~/lib/identity.service'
import { PolygonIdService } from '~/lib/polygon-id.service'
import { proofRequests } from '~/lib/proof-requests'
import type { Account } from '~/types/account'

export default () => {
  const config = useRuntimeConfig()

  const accounts = useLocalStorage<Account[]>('accounts', [])
  const currentAccount = reactive<Account>(accounts.value.filter(v => v.isActive === true)[0])
  const credentials = useLocalStorage<W3CCredential[]>('credentials', [])
  const issuers = useLocalStorage<Account[]>('issuers', [])
  const progress = ref(CircuitStorageInstance.progress)

  const { wallet } = useWallet()

  async function issueCredentials(account: Account, claims: CredentialRequest) {
    const { wallet: idWallet, credWallet, dataStorage } = PolygonIdService.getExtensionServiceInstance()
    const { did: issuerDID } = await IdentityServices.createIdentity()

    issuers.value.push({ name: 'Issuer', did: issuerDID, isActive: false })

    const issuerCred = await idWallet?.issueCredential(issuerDID, claims)

    if (issuerCred && dataStorage)
      await credWallet?.save(issuerCred)

    await updateCredentials()
  }

  async function generateProof(credential: W3CCredential, proofReq: ZeroKnowledgeProofRequest, issuerDID: core.DID) {
    const { wallet: idWallet, dataStorage, proofService } = PolygonIdService.getExtensionServiceInstance()

    console.log(credential, proofReq)

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

    const proof = await proofService!.generateProof(proofReq, new core.DID(currentAccount.did))

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
