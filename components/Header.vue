<script setup lang="ts">
import { DarkToggle } from '~/components/utils'

const { contract } = useLoyaltyContract()
const { wallet } = useWallet()
const pointsBalance = ref(0)

onMounted(async () => {
  pointsBalance.value = Number(await contract.loyaltyPoints('0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141', wallet.address))

  contract.on('Exchanged', async () => {
    pointsBalance.value = Number(await contract.loyaltyPoints('0x80Cbc1f7fd60B7026C0088e5eD58Fc6Ce1180141', wallet.address))
  })
})
</script>

<template>
  <header class="sticky bg-background/50 dark:bg-background/80 backdrop-blur z-100 top-0">
    <div class="max-w-[1400px] w-full mx-auto py-2 px-2 flex justify-end overflow-hidden">
      <div class="w-full flex items-center justify-end gap-4">
        <TextCode class="truncate">
          {{ pointsBalance }} pts
        </TextCode>

        <DarkToggle />
      </div>
    </div>
  </header>
</template>
