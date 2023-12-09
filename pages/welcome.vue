<script setup lang="ts">
import type { HDNodeWallet } from 'ethers'

import { IdentityServices } from '~/lib/identity.service'
import { MnemonicService } from '~/lib/mnemonic.service'

import type { Account } from '~/types/account'

const router = useRouter()

const accounts = useLocalStorage<Account[]>('accounts', [])
const phrase = ref<string>('')

const wallet = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet)
const mnemonic = ref<string>('')

const loading = ref<boolean>(false)
const { progress } = usePolygonID()

async function createAccount() {
  loading.value = true

  const { mnemonic, seed, wallet: newWallet } = await MnemonicService.generate()

  phrase.value = mnemonic

  console.log(seed.slice(0, 32))

  const identity = await IdentityServices.createIdentity(seed.slice(0, 32))

  accounts.value.push({ name: 'PolygonID account', did: identity.did, isActive: true })
  wallet.value = newWallet

  router.push('/')
}

async function createAccountFromPhrase() {
  loading.value = true

  const { seed, wallet: newWallet } = await MnemonicService.get_from_mnemonic(mnemonic.value)

  phrase.value = mnemonic.value

  console.log(seed.slice(0, 32))

  try {
    const identity = await IdentityServices.createIdentity(seed.slice(0, 32))
    if (accounts.value.filter(v => v.did.id === identity.did.id).length === 0)
      accounts.value.push({ name: 'PolygonID account', did: identity.did, isActive: true })
  }
  catch (err) {
    console.log(err)
  }

  wallet.value = newWallet

  router.push('/')
}

definePageMeta({
  layout: 'welcome',
})
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center py-6 px-4 gap-4">
    <TextH1>
      Welcome
    </TextH1>
    <div v-if="progress === 100" class="flex flex-col gap-4 items-center">
      <div class="flex gap-2 items-end">
        <div>
          <UiLabel for="mnemonic">
            Phrase
          </UiLabel>
          <UiInput id="mnemonic" v-model="mnemonic" type="text" />
        </div>

        <UiButton :disabled="loading" @click="createAccountFromPhrase">
          <span v-if="loading" class="i-mingcute:loading-3-fill mr-2 h-4 w-4 animate-spin" />
          From seed phrase
        </UiButton>
      </div>

      <div class="">
        or
      </div>

      <UiButton class="w-full" :disabled="loading" @click="createAccount">
        <span v-if="loading" class="i-mingcute:loading-3-fill mr-2 h-4 w-4 animate-spin" />
        Create account
      </UiButton>
    </div>

    <div v-else class="w-full flex items-center justify-center">
      <div class="w-[60%]">
        <UiProgress v-model="progress" />
      </div>
      <TextMuted>Init circuits db...</TextMuted>
    </div>
  </div>
</template>
