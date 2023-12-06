<script setup lang="ts">
import { ExchangeState } from '~/components/core'
import { useToast } from '~/components/ui/toast/use-toast'
import type { Exchange } from '~/types/exchange'

// Nuxt plugins
const { $on } = useNuxtApp()

// Composables
const { contract } = useLoyaltyContract()
const { wallet } = useWallet()
const { toast } = useToast()

const { progress } = usePolygonID()

// Refs
const sheet = ref<VNode>()
const exchanges = useLocalStorage<Exchange[]>('exchanges', [])

onMounted(() => {
  if (!contract)
    throw new Error('Contract not defined')
  contract.on(contract.filters.AnnounceLoyaltyPoints, (shop: string, user: string, receiptId: string, points: bigint, dataFormatId: bigint) => {
    console.log(shop, typeof shop, user, typeof user, receiptId, typeof receiptId, points, typeof points, dataFormatId, typeof dataFormatId)
    if (user === wallet.address) {
      const exchange = ref<Exchange>({
        shop,
        user,
        receiptId,
        points: Number(points).toString(),
        dataFormatId: Number(dataFormatId).toString(),
        state: ExchangeState.Idle,
      })

      exchanges.value.push(exchange.value)

      toast({
        title: 'Exchange request',
        description: `Received exchange request from shop: ${exchange.value.shop} \n Points: ${exchange.value.points}`,
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
            description: 'Successfuly exchanged points for KYCAgeCredential',
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
  <div class="h-screen flex flex-col">
    <Header />
    <div v-if="progress === 100" class="max-w-[1400px] flex-1 w-full mx-auto overflow-auto">
      <slot />
    </div>
    <div v-else class="w-full h-full flex flex-col gap-6 items-center justify-center">
      <TextH1>
        Loyalty Web3
      </TextH1>
      <div class="w-[60%]">
        <UiProgress v-model="progress" />
      </div>
    </div>
    <Footer v-if="progress === 100" />
  </div>
  <UiToaster />
  <component :is="sheet" />
</template>
