import type { ExchangeState } from '~/components/core'

export interface Exchange {
  shop: string
  user: string
  receiptId: string
  points: string
  dataFormatId: string
  state: ExchangeState
}
