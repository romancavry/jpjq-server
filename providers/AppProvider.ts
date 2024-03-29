import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { CoinMarketClient } from 'App/Services/Client/CoinMarket'
import { CashMarketClient } from 'App/Services/Client/CashMarket'

import CurrenciesStore from 'App/Modules/currencies/store'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('App/Services/Client/CoinMarket', () => {
      return new CoinMarketClient(this.app.config.get('services.coinMarket'))
    })

    this.app.container.singleton('App/Services/Client/CashMarket', () => {
      return new CashMarketClient(this.app.config.get('services.cashMarket'))
    })

    this.app.container.singleton('App/Modules/currencies/store', () => {
      return new CurrenciesStore()
    })

    // Register your own bindings
  }

  public async boot() {
    // IoC container is ready
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
