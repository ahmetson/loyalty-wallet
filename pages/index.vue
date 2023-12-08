<script setup lang="ts">
const { wallet } = useWallet()
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-6 px-6">
    <div class="flex items-center justify-between">
      <TextH2>Accounts</TextH2>
    </div>

    <div class="w-full flex flex-col gap-3">
      <div class="flex flex-col bg-gradient-to-br from-emerald-600 to-teal-900 px-3 py-3 rounded-xl gap-3">
        <div class="flex gap-2 justify-between text-white">
          <TextP class="truncate max-w-full bg-muted/40 px-2 rounded-md">
            {{ wallet.address }}
          </TextP>
        </div>
      </div>
    </div>
  </div>
</template>
