import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { Wallet, HDNodeWallet } from 'ethers'

export class MnemonicService {
  static async generate(): Promise<{
    mnemonic: string
    seed: Uint8Array
    wallet: HDNodeWallet
  }> {
    const mnemonic = generateMnemonic()

    const seed = Uint8Array.from(await mnemonicToSeed(mnemonic))

    const wallet = Wallet.fromPhrase(mnemonic)

    return {
      mnemonic,
      seed,
      wallet,
    }
  }

  static async get_from_mnemonic(mnemonic: string): Promise<{
    seed: Uint8Array
    wallet: HDNodeWallet
  }> {
    const wallet = Wallet.fromPhrase(mnemonic)
    const seed = Uint8Array.from(await mnemonicToSeed(mnemonic))

    return {
      seed,
      wallet,
    }
  }
}
