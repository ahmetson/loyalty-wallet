<script setup lang="ts">
import type { HDNodeWallet } from 'ethers'
import { QRCode } from '@/components/utils'
import type { Account } from '~/types/account'

const qrText = ref<string>('test')
const accounts = useLocalStorage<Account[]>('accounts', [] as Account[])
const wallet = useLocalStorage<HDNodeWallet>('accounts', {} as HDNodeWallet)
</script>

<template>
  <div class="h-full flex py-4 flex-col gap-6 px-6">
    <div class="flex items-center justify-between">
      <TextH2>Accounts</TextH2>
    </div>

    <div class="w-full flex flex-col">
      <div v-for="account in accounts" :key="account.did.id" class="bg-indigo px-4 py-4 rounded-md">
        <TextP class="truncate max-w-full bg-muted/50 px-2 rounded-md">
          {{ account.did.id }}
        </TextP>
      </div>
    </div>
  </div>
</template>
