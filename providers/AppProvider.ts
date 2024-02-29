import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

import { CoinMarketClient } from 'App/Services/Client/CoinMarket'

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    this.app.container.singleton('App/Services/Client/CoinMarket', () => {
      return new CoinMarketClient(this.app.config.get('services.coinMarket'))
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
