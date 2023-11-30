<script setup lang="ts">
import type { HDNodeWallet } from 'ethers';
import { DarkToggle } from '~/components/utils'

const wallet = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet)
</script>

<template>
  <div class="h-screen flex flex-col">
    <header class="border-b border-border">
      <div class="max-w-[1400px] w-full mx-auto py-4 px-2 flex justify-end overflow-hidden">
        
        <div class="flex items-center gap-4">
          <TextCode class="truncate max-w-[150px]" v-if="wallet">{{ wallet.address }}</TextCode>
          <DarkToggle />
        </div>
        
      </div>
    </header>
  <div class="max-w-[1400px] flex-1 w-full mx-auto overflow-auto">
    <slot/>
  </div>
  <footer class="flex items-center h-[60px] bottom-0 left-0 w-full bg-background/50 border-t border-border">
    <nav class="flex space-x-4">
        <NuxtLink to="/">
          <UiButton variant="link">
            QR Code
          </UiButton>
        </NuxtLink>
        <NuxtLink to="/scan">
          <UiButton variant="link">
            Scan
          </UiButton>
        </NuxtLink>
      </nav>
  </footer>
  </div>
  
</template>
