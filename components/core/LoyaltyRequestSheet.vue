<script setup lang="ts">
import { core } from '@0xpolygonid/js-sdk'
import type { W3CCredential } from '@0xpolygonid/js-sdk'

const props = defineProps<{
  shop: string
  user: string
  points: string
  receiptId: string
  dataFormatId: string
}>()

const { $emit } = useNuxtApp()

const { contract } = useLoyaltyContract()
const { currentAccount, issuers, credentials, generateProof } = usePolygonID()

const open = ref<boolean>(true)
const loading = ref(false)

const credential = computed<W3CCredential>(() => {
  return credentials.value.find((v) => {
    const credId = v.credentialSubject.id as string
    return credId.slice(14) === currentAccount.did.id && v.type[1] === 'KYCAgeCredential'
  }) as W3CCredential
})

async function sendProof() {
  loading.value = true
  console.log('click')
  const response = await generateProof(credential.value, new core.DID(issuers.value.find((v) => {
    return v.did.id === credential.value.issuer.slice(14)
  })?.did))
  if (!response)
    throw new Error('Proof generation blocked')
  const result = await contract.submitPersonalData(props.shop, props.receiptId, JSON.stringify(response.proof))
  console.log(result, response.proof, response.sigProofOk)
  loading.value = true
  open.value = false
  $emit('notification:destroy')
}
</script>

<template>
  <UiSheet :default-open="true" :open="open" @update:open="(v) => { open = v; $emit('notification:destroy') }">
    <UiSheetContent class="rounded-t-3xl" side="bottom">
      <UiSheetHeader>
        <UiSheetTitle class="flex flex-col items-center">
          Request from shop
          <TextP class="max-w-250px truncate text-lg">
            {{ shop }}
          </TextP>
        </UiSheetTitle>

        <div>
          {{ useHexString(receiptId) }}
        </div>

        <div class="space-y-4">
          <div>
            <TextH4 class="m-0">
              KYCAgeCredential
            </TextH4>
            <TextH4 class="[&:not(:first-child)]:mt-2">
              for {{ points }} points
            </TextH4>
          </div>

          <UiSheetDescription>
            This action cannot be undone. This will exchange your data for loyalty points.
          </UiSheetDescription>

          <UiButton :disabled="loading" class="w-full font-bold" @click="sendProof">
            Exchange proof
          </UiButton>
        </div>
      </UiSheetHeader>
    </UiSheetContent>
  </UiSheet>
</template>
