<script setup lang="ts">
import { ExchangeState } from '~/components/core'
import { Code } from '~/components/typography'
import { useToast } from '~/components/ui/toast/use-toast'
import type { Exchange } from '~/types/exchange'

// Nuxt plugins
const { $on } = useNuxtApp()
const config = useRuntimeConfig()

// Composables
const { contract } = useLoyaltyContract()
const { wallet } = useWallet()
const { toast } = useToast()

const { progress } = usePolygonID()

// Refs
const sheet = ref<VNode>()
const exchanges = useLocalStorage<Exchange[]>('exchanges', [])

onMounted(() => {
  console.log(config)
  if (!contract)
    throw new Error('Contract not defined')
  contract.on(contract.filters.AnnounceLoyaltyPoints, (shop: string, user: string, receiptId: string, points: bigint, dataFormatId: bigint) => {
    console.log(shop, typeof shop, user, typeof user, receiptId, typeof receiptId, points, typeof points, dataFormatId, typeof dataFormatId)
    if (user === wallet.address) {
      console.log('received')
      const exchange = ref<Exchange>({
        shop,
        user,
        receiptId,
        credentialId: Number(dataFormatId),
        points: Number(points).toString(),
        dataFormatId: Number(dataFormatId).toString(),
        state: ExchangeState.Idle,
      })

      exchanges.value.push(exchange.value)

      toast({
        title: 'Exchange request',
        description: h('div', ['Received exchange request from shop: ', h(Code, () => exchange.value.shop), `\n Points: ${exchange.value.points}`]),
      })
    }
  })

  contract.on(contract.filters.Exchanged, (shop: string, user: string, receiptId: string) => {
    if (user === wallet.address) {
      const newExchanges = exchanges.value.map((v) => {
        if (v.receiptId === receiptId) {
          v.state = ExchangeState.Success
          toast({
            title: 'Exchange success',
            description: `You received your ${v.points} from Sony`,
          })
          return v
        }

        return v
      })

      exchanges.value = newExchanges
    }
  })
  $on('notification:destroy', () => sheet.value = undefined)
})
</script>

<template>
  <div class="h-screen relative">
    <Header />
    <div v-if="progress === 100" class="max-w-[1400px] mb-15 w-full mx-auto overflow-y-auto">
      <slot />
    </div>
    <div v-else class="w-full h-full flex flex-col gap-6 items-center justify-center">
      <TextH1>
        Loyalty Web3
      </TextH1>
      <div class="w-[60%]">
        <UiProgress v-model="progress" />
      </div>
      <TextMuted>Loading circuits...</TextMuted>
    </div>
    <Footer v-if="progress === 100" />
  </div>
  <UiToaster />
  <component :is="sheet" />
</template>
