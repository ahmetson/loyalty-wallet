import { HDNodeWallet, Wallet } from 'ethers'
import type { Account } from '~/types/account'

export const useWalletStore = defineStore('wallets', () => {
  const wallet = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet, {
    serializer: {
      read(v: string) {
        const parsed = JSON.parse(v) as HDNodeWallet
        if (parsed.mnemonic && parsed.mnemonic.phrase)
          return HDNodeWallet.fromPhrase(parsed.mnemonic?.phrase)
        else return HDNodeWallet.createRandom()
      },
      write(v: HDNodeWallet) {
        return JSON.stringify(v)
      },
    },
  })
  const issuers = useLocalStorage<Account[]>('issuers', [])

  const isAuthenticated = computed(() => wallet.value !== undefined)

  return {
    wallet,
    issuers,
    isAuthenticated,
  }
})
