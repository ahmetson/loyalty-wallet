<script setup lang="ts">
import { ExchangeState } from '~/components/core'
import ExchangeSheet from '~/components/core/ExchangeSheet.vue'
import type { Exchange } from '~/types/exchange'

// Nuxt plugins
const { $on } = useNuxtApp()

// Composables
const { contract } = useLoyaltyContract()
const { wallet } = useWallet()

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

      sheet.value = h(ExchangeSheet, {
        'exchange': exchange.value,
        'defaultOpen': true,
        'onVnodeBeforeUnmount': () => {
          console.log('unmounted')
        },
        'onUpdate:exchange': (v: Exchange) => {
          exchange.value = v
        },
      })
    }
  })
  $on('notification:destroy', () => sheet.value = undefined)
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <Header />
    <div class="max-w-[1400px] flex-1 w-full mx-auto overflow-auto">
      <slot />
    </div>
    <Footer />
  </div>
  <component :is="sheet" />
</template>
