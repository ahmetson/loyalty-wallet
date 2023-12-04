import type { HDNodeWallet } from 'ethers'
import { HDNodeVoidWallet, Wallet } from 'ethers'

export default () => {
  const saved = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet)
  const wallet = ref<HDNodeWallet>()

  onMounted(() => {
    if (saved.value.mnemonic && saved.value.mnemonic.phrase && !wallet.value) {
      console.log('wallet defined')
      wallet.value = Wallet.fromPhrase(saved.value.mnemonic.phrase)
    }
  })

  return {
    wallet,
  }
}
