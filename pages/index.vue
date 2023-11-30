<script setup lang="ts">
import { type HDNodeWallet, Wallet, ethers } from 'ethers'
import { CircuitId, CredentialStatusType, ProofService, core } from '@0xpolygonid/js-sdk'
import type { CredentialRequest, EthStateStorage, IProofService, ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'
import type { Account } from '~/types/account'
import { IdentityServices } from '~/lib/identity.service'
import { PolygonIdService } from '~/lib/polygon-id.service'

const config = useRuntimeConfig()

const qrText = ref<string>('test')
const accounts = useLocalStorage<Account[]>('accounts', [] as Account[])
const currentAccount = ref<Account>(accounts.value.filter(v => v.isActive === true)[0])
const wallet = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet)

async function issueCredentials(account: Account) {
  const { wallet: idWallet, credWallet, dataStorage, circuitStorage, proofService } = PolygonIdService.getExtensionServiceInstance()
  const { did: issuerDID } = await IdentityServices.createIdentity()

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

  if (issuerCred && dataStorage) {
    await credWallet?.save(issuerCred)

    const res = await idWallet?.addCredentialsToMerkleTree(
      [issuerCred],
      issuerDID,
    )
    await idWallet?.publishStateToRHS(issuerDID, config.public.RHS_URL)

    // wallet.value.connect()
    const jsonRpc = (dataStorage.states as EthStateStorage).provider
    console.log(wallet.value)
    const signer = ethers.Wallet.fromPhrase(wallet.value.mnemonic!.phrase).connect(jsonRpc)
    console.log(signer)

    if (res && res.oldTreeState) {
      const proofService: IProofService = new ProofService(idWallet!, credWallet!, circuitStorage!, dataStorage.states, { ipfsNodeURL: 'https://ipfs.io' })

      const txId = await proofService.transitState(
        issuerDID,
        res.oldTreeState,
        true,
        dataStorage.states,
        signer,
      )

      console.log(txId)

      const proofReqSig: ZeroKnowledgeProofRequest = {
        id: 1,
        circuitId: CircuitId.AtomicQuerySigV2,
        optional: false,
        query: {
          allowedIssuers: ['*'],
          type: claimReq.type,
          context:
          'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld',
          credentialSubject: {
            documentType: {
              $eq: 99,
            },
          },
        },
      }

      setTimeout(async () => {
        const { proof, vp } = await proofService.generateProof(proofReqSig, new core.DID(account.did))

        console.log(proof, vp)
      }, 5000)
    }
  }

  console.log(await credWallet?.list())
}
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-6 px-6">
    <div class="flex items-center justify-between">
      <TextH2>Accounts</TextH2>
    </div>

    <div class="w-full flex flex-col">
      <div v-for="account in accounts" :key="account.did.id" class="flex flex-col bg-indigo px-4 py-4 rounded-xl gap-4">
        <TextP class="truncate max-w-full bg-muted/50 px-2 rounded-md">
          {{ account.did.id }}
        </TextP>
        <div class="flex justify-end">
          <UiButton class="bg-transparent border-border/20" variant="outline" size="sm" @click="issueCredentials(account)">
            Issue credential
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
