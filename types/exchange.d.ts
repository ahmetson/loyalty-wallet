import type { ExchangeState } from '~/components/core'

export interface Exchange {
  shop: string
  user: string
  receiptId: string
  credentialId: number
  pubKey: string
  points: string
  dataFormatId: string
  state: ExchangeState
}
