import type { HDNodeWallet, ethers } from 'ethers'
import { Wallet } from 'ethers'

let wallet: ethers.HDNodeWallet

export default () => {
  const saved = useLocalStorage<HDNodeWallet>('wallet', {} as HDNodeWallet)
  if (saved.value.mnemonic && saved.value.mnemonic.phrase && !wallet) {
    console.log('wallet defined')
    wallet = Wallet.fromPhrase(saved.value.mnemonic.phrase)
  }

  return {
    wallet,
  }
}
