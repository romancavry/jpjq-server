import { Exception } from '@adonisjs/core/build/standalone'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import CoinMarketClient from '@ioc:App/Services/Client/CoinMarket'
import CurrenciesStore from '@ioc:App/Modules/currencies/store'

import { ERROR_CODES } from 'App/Utils/errorUtils'

export default class CryptoController {
  /**
   * Получение информации о валютах с внешнего API
   */
  private async getCurrenciesInfoFromExternalApi() {
    const currenciesInfo = await CoinMarketClient.getCurrenciesInfo()

    if (!currenciesInfo) {
      throw new Exception('Coin market error', 500, ERROR_CODES.COIN_MARKET_SERVER_ERROR)
    }

    currenciesInfo.data.forEach((currency) => {
      CurrenciesStore.setCurrency({ newValue: currency, slug: currency.symbol.toLowerCase() })
    })
  }

  /**
   * Получение информации о конкретной валюте по ее slug
   */
  public async getCurrencyInfo({ request, response }: HttpContextContract) {
    // Validating query
    await request.validate({
      schema: schema.create({
        slug: schema.string(),
      }),
    })

    // Fullfill the store
    if (CurrenciesStore.empty()) {
      await this.getCurrenciesInfoFromExternalApi()
    }

    const slug: string = request.qs().slug.toLowerCase()

    return response.send({ data: CurrenciesStore.getCurrency(slug) })
  }

  /**
   * Получение всей коллекции валюты
   */
  public async getCurrenciesCollection({ response }: HttpContextContract) {
    // Fullfill the store
    if (CurrenciesStore.empty()) {
      await this.getCurrenciesInfoFromExternalApi()
    }

    return response.json({ data: Object.fromEntries(CurrenciesStore.getCollection()) })
  }
}
