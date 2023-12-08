<script setup lang="ts">
import type { Exchange } from '~/types/exchange'
import ExchangeSheet from '~/components/core/ExchangeSheet.vue'
import { ExchangeState } from '~/components/core'

const exchanges = useLocalStorage<Exchange[]>('exchanges', [])
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-3 px-6">
    <div class="flex items-center justify-between mb-3">
      <TextH2>Exchanges</TextH2>
    </div>
    <div class="flex items-center justify-between">
      <TextH3>Requested</TextH3>
    </div>
    <div v-if="exchanges.filter((v) => ![ExchangeState.Error, ExchangeState.Rejected, ExchangeState.Success].includes(v.state)).length > 0" class="w-full flex flex-col gap-3">
      <div v-for="exchange in exchanges.filter((v) => ![ExchangeState.Error, ExchangeState.Rejected, ExchangeState.Success].includes(v.state))" :key="exchange.receiptId" class="flex flex-col bg-gradient-to-br from-emerald-700 to-teal-800 dark:to-transparent px-3 py-3 rounded-xl gap-3">
        <ExchangeSheet :exchange="exchange" :default-open="false">
          <div class="flex flex-col sm:flex-row justify-between items-center mb-2 text-white">
            <TextH4 class="truncate">
              KYCAgeCredential
            </TextH4>
            <div class="flex flex-col sm:flex-row items-center gap-2">
              <TextSmall>
                {{ exchange.state }}
              </TextSmall>
              <TextCode class="bg-muted/20">
                <div>
                  {{ exchange.points }} points
                </div>
              </TextCode>
            </div>
          </div>
          <div class="flex gap-2 justify-between text-white">
            <div class="truncate flex gap-2 items-center">
              Shop:
              <TextSmall class="truncate max-w-150px bg-muted/50 px-2 rounded-md py-2 uppercase">
                {{ exchange.shop }}
              </TextSmall>
            </div>

            <div class="truncate flex gap-2 items-center">
              ID:
              <TextSmall class="truncate max-w-full bg-muted/50 px-2 rounded-md py-2 uppercase">
                {{ useHexString(exchange.receiptId) }}
              </TextSmall>
            </div>
          </div>
        </ExchangeSheet>
      </div>
    </div>
    <div v-else class="flex items-center justify-center h-20">
      <TextMuted>
        No requested exchanges.
      </TextMuted>
    </div>
    <div v-if="exchanges.filter(v => [ExchangeState.Error, ExchangeState.Rejected, ExchangeState.Success].includes(v.state)).length > 0" class="flex items-center justify-between">
      <TextH3>
        Fulfilled
      </TextH3>
    </div>
    <div v-if="exchanges.filter(v => [ExchangeState.Error, ExchangeState.Rejected, ExchangeState.Success].includes(v.state)).length > 0" class="w-full flex flex-col gap-3">
      <div v-for="exchange in exchanges.filter(v => [ExchangeState.Error, ExchangeState.Rejected, ExchangeState.Success].includes(v.state))" :key="exchange.receiptId" class="flex flex-col bg-gradient-to-br from-emerald-600 to-teal-800 dark:to-transparent px-3 py-3 rounded-xl gap-3 filter-grayscale">
        <ExchangeSheet :exchange="exchange" :default-open="false">
          <div class="flex flex-col sm:flex-row justify-between items-center mb-2 text-white">
            <TextH4 class="truncate">
              KYCAgeCredential
            </TextH4>
            <div class="flex flex-col sm:flex-row items-center gap-2">
              <TextSmall>
                {{ exchange.state }}
              </TextSmall>
              <TextCode class="bg-muted/20">
                <div>
                  {{ exchange.points }} points
                </div>
              </TextCode>
            </div>
          </div>
          <div class="flex gap-2 justify-between text-white">
            <div class="truncate flex gap-2 items-center">
              Shop:
              <TextSmall class="truncate max-w-150px bg-muted/50 px-2 rounded-md py-2 uppercase">
                {{ exchange.shop }}
              </TextSmall>
            </div>

            <div class="truncate flex gap-2 items-center">
              ID:
              <TextSmall class="truncate max-w-full bg-muted/50 px-2 rounded-md py-2 uppercase">
                {{ useHexString(exchange.receiptId) }}
              </TextSmall>
            </div>
          </div>
        </ExchangeSheet>
      </div>
    </div>
  </div>
</template>
