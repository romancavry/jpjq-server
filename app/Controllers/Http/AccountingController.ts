import { Exception } from '@adonisjs/core/build/standalone'

import CoinMarketClient from '@ioc:App/Services/Client/CoinMarket'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import CurrenciesStore from '@ioc:App/Modules/currencies/store'

import { ERROR_CODES } from 'App/Utils/errorUtils'

export default class AccountingController {
  public async getAllCurrencies() {
    const currenciesInfo = await CoinMarketClient.getCurrenciesInfo()

    if (!currenciesInfo) {
      throw new Exception('Coin market error', 400, ERROR_CODES.COIN_MARKET_SERVER_ERROR)
    }

    currenciesInfo.data.forEach((currency) => {
      CurrenciesStore.setCurrency({ newValue: currency, slug: currency.symbol.toLowerCase() })
    })
  }

  public async getCurrencyInfo({ request, response }: HttpContextContract) {
    // Validating query
    await request.validate({
      schema: schema.create({
        slug: schema.string(),
      }),
    })

    // Fullfill the store
    if (!CurrenciesStore.getSize()) {
      await this.getAllCurrencies()
    }

    const slug: string = request.qs().slug.toLowerCase()

    return response.send(CurrenciesStore.getCurrency(slug))
  }
}
