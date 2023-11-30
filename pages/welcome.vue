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

async function createAccount() {
  loading.value = true

  const { mnemonic, seed, wallet: newWallet } = await MnemonicService.generate()

  phrase.value = mnemonic

  console.log(seed.slice(0, 32))

  const identity = await IdentityServices.createIdentity(seed.slice(0, 32))

  accounts.value.push({ name: 'PolygonID account', did: identity.did, isActive: true })
  wallet.value = newWallet

  loading.value = false

  router.push('/')
}

async function createAccountFromPhrase() {
  loading.value = true

  const { seed, wallet: newWallet } = await MnemonicService.get_from_mnemonic(mnemonic.value)

  phrase.value = mnemonic.value

  console.log(seed.slice(0, 32))

  try {
    const identity = await IdentityServices.createIdentity(seed.slice(0, 32))
    if (accounts.value.filter((v) => v.did.id === identity.did.id).length === 0)
      accounts.value.push({ name: 'PolygonID account', did: identity.did, isActive: true })
  } catch(err) {
    console.log(err)
  }
  
  wallet.value = newWallet

  loading.value = false

  router.push('/')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-6 px-4 gap-4">
    <TextH1>
      Welcome
    </TextH1>
    <div class="flex gap-4 items-end" >
      <div>
        <UiLabel for="mnemonic">Phrase</UiLabel>
        <UiInput id="mnemonic" v-model="mnemonic" type="text" />
      </div>

      <UiButton :disabled="loading" @click="createAccountFromPhrase">
        From seed phrase
      </UiButton>

      <UiButton :disabled="loading" @click="createAccount">
        Create account
      </UiButton>
    </div>

    <div v-if="wallet && phrase">
      {{ wallet.address }}
      {{ wallet.mnemonic }}
      {{ wallet.publicKey }}
    </div>
  </div>
</template>
