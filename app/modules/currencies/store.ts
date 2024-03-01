import type { Currency } from 'App/Modules/currencies'

export default class CurrenciesStore {
  private currencies: Map<string, Currency>

  constructor() {
    this.currencies = new Map()
  }

  public setCurrency({ newValue, slug }: { newValue: Currency; slug: string }) {
    this.currencies.set(slug, newValue)
  }

  public getCurrency(slug: string) {
    return this.currencies.get(slug)
  }

  public getCollection() {
    return this.currencies
  }

  public empty() {
    return !this.currencies.size
  }
}
