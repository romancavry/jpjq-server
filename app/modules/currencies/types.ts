import { CURRENCY_TYPE, CURRENCY_VALUE } from './constants'

export type CurrencyType = (typeof CURRENCY_TYPE)[keyof typeof CURRENCY_TYPE]

export type CurrencyValue = (typeof CURRENCY_VALUE)[keyof typeof CURRENCY_VALUE]

export interface CurrencyValueItem {
  price: number
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
  percentChange24h: number
  percentChange7d: number
  percentChange30d: number
  percentChange3m: number
  percentChange6m: number
}

export interface CurrencyPlatform {
  id: number
  name: string
  slug: string
}

export interface CurrencyToken {
  tokenAddress?: string
  platform: CurrencyPlatform
}

export interface Currency {
  id: number
  rank: number
  slug: string
  symbol: string
  category: string
  type: CurrencyType
  volume24hBase: number
  circulatingSupply: number
  totalSupply: number
  maxSupply: number
  values: Record<CurrencyValue, CurrencyValueItem>
  lastUpdated: string
  tokens: CurrencyToken[]
}
