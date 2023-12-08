import { Wallet, WebSocketProvider, ethers } from 'ethers'
import { abi } from '~/lib/abi'

let ethSigner: ethers.Signer
let contract: ethers.Contract

export default () => {
  const config = useRuntimeConfig()

  const { wallet } = useWallet()
  const rpc = new WebSocketProvider(config.public.ETH_WS_URL)

  if (!wallet || !wallet.mnemonic)
    throw new Error('Wallet not defined')

  ethSigner = Wallet.fromPhrase(wallet.mnemonic.phrase).connect(rpc)
  contract = new ethers.Contract(config.public.LOYALTY_CONTRACT_ADDRESS, abi, ethSigner)

  return {
    contract,
  }
}
