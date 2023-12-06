<script setup lang="ts">
import { DarkToggle } from '~/components/utils'

const { wallet } = useWallet()
</script>

<template>
  <header>
    <div class="max-w-[1400px] w-full mx-auto py-4 px-2 flex justify-end overflow-hidden">
      <div class="flex items-center gap-4">
        <TextCode v-if="wallet" class="truncate max-w-[150px]">
          {{ wallet.address }}
        </TextCode>
        <DarkToggle />
      </div>
    </div>
  </header>
</template>
