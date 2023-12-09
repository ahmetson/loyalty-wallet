<script setup lang="ts">
import { core } from '@0xpolygonid/js-sdk'
import type { W3CCredential, ZeroKnowledgeProofRequest } from '@0xpolygonid/js-sdk'
import { ExchangeState } from '.'
import type { Exchange } from '~/types/exchange'
import { proofRequests } from '~/lib/proof-requests'

const props = defineProps<{
  exchange: Exchange
  defaultOpen: boolean
}>()

const emit = defineEmits(['update:exchange'])
const { $emit } = useNuxtApp()
const { contract } = useLoyaltyContract()
const { currentAccount, issuers, credentials, generateProof } = usePolygonID()

const open = ref<boolean>(false)
const exchange = computed<Exchange>({
  get() {
    return props.exchange
  },
  set(v: Exchange) {
    console.log(v)
    emit('update:exchange', v)
  },
})

const credential = computed<W3CCredential>(() => {
  return credentials.value.find((v) => {
    const credId = v.credentialSubject.id as string
    return credId.slice(14) === currentAccount.did.id && v.type[1] === 'KYCAgeCredential'
  }) as W3CCredential
})

async function sendProof() {
  exchange.value.state = ExchangeState.Proof
  console.log('click')
  const proofReq = proofRequests.get(exchange.value.credentialId) as ZeroKnowledgeProofRequest
  const response = await generateProof(credential.value, proofReq, new core.DID(issuers.value.find((v) => {
    return v.did.id === credential.value.issuer.slice(14)
  })?.did))
  if (!response)
    throw new Error('Proof generation blocked')
  console.log(response.proof, exchange.value.user, exchange.value.receiptId, 1)
  const result = await contract.submitPersonalData(props.exchange.shop, props.exchange.receiptId, JSON.stringify(response.proof))
  console.log(result, response.proof, response.sigProofOk)
  exchange.value.state = ExchangeState.Await
}

async function rejectRequest() {
  exchange.value.state = ExchangeState.Rejecting
  console.log('click')
  const result = await contract.rejectExchange(props.exchange.shop, props.exchange.receiptId)
  console.log(result)
  open.value = false
  exchange.value.state = ExchangeState.Rejected
}

onMounted(async () => {
  if (!contract)
    throw new Error('Contract not defined')
  contract.on(contract.filters.Exchanged, (shop: string, user: string, receiptId: string) => {
    if (receiptId === props.exchange.receiptId) {
      exchange.value.state = ExchangeState.Success
      console.log(shop, user, receiptId)
    }
  })
})

onErrorCaptured(() => {
  exchange.value.state = ExchangeState.Error
})
</script>

<template>
  <UiSheet :open="open" :default-open="defaultOpen" @update:open="(v) => { open = v }">
    <UiSheetTrigger>
      <slot />
    </UiSheetTrigger>
    <UiSheetContent class="rounded-t-3xl" side="bottom">
      <UiSheetHeader>
        <UiSheetTitle class="flex flex-col items-center">
          Request from Sony
        </UiSheetTitle>

        <div>
          <TextMuted>ID: {{ useHexString(exchange.receiptId) }}</TextMuted>
        </div>

        <div v-if="[ExchangeState.Idle, ExchangeState.Proof].includes(exchange.state)" class="space-y-4">
          <div>
            <TextH4 class="m-0">
              Exchange your data:
            </TextH4>
            <TextLead>
              * BIRTHDAY
            </TextLead>
            <TextH4 class="[&:not(:first-child)]:mt-2">
              for {{ exchange.points }} points
            </TextH4>
          </div>

          <UiSheetDescription>
            <div>Your data is cryptographically modified.</div>
            <div>E.g your birthday is 2001.01.01.</div>
            <div>Provided data: </div>
            <div>User birthday is below 2005.01.01.</div>
          </UiSheetDescription>

          <UiButton :disabled="[ExchangeState.Proof, ExchangeState.Rejecting].includes(exchange.state)" class="w-full font-bold" @click="sendProof">
            <span v-if="exchange.state === ExchangeState.Proof" class="i-mingcute:loading-3-fill mr-2 h-4 w-4 animate-spin" />
            Accept
          </UiButton>
          <UiButton :disabled="[ExchangeState.Proof, ExchangeState.Rejecting].includes(exchange.state)" variant="destructive" class="w-full font-bold" @click="rejectRequest">
            <span v-if="exchange.state === ExchangeState.Rejecting" class="i-mingcute:loading-3-fill mr-2 h-4 w-4 animate-spin" />
            Deny
          </UiButton>
        </div>

        <div
          v-if="exchange.state === ExchangeState.Await"
          class="flex flex-col items-center text-muted-foreground/60"
        >
          <div class="i-carbon:notification-new text-30" />
          Your data is being shared, you will receive your rewards shortly!
        </div>

        <div v-if="exchange.state === ExchangeState.Success" class="flex flex-col items-center text-muted-foreground/60">
          <div class="i-clarity:success-standard-line text-30" />
          <TextH4>
            Successfuly exchanged!
          </TextH4>
        </div>
        <div v-if="exchange.state === ExchangeState.Error" class="flex flex-col items-center text-muted-foreground/60">
          <div class="i-carbon:error text-30" />
          <TextH4>
            Error happend!
          </TextH4>
        </div>
        <div v-if="exchange.state === ExchangeState.Rejected" class="flex flex-col items-center text-muted-foreground/60">
          <div class="i-carbon:error text-30" />
          <TextH4>
            Request rejected.
          </TextH4>
        </div>
      </UiSheetHeader>
    </UiSheetContent>
  </UiSheet>
</template>
