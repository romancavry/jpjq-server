import { Exception } from '@adonisjs/core/build/standalone'

import CoinMarketClient from '@ioc:App/Services/Client/CoinMarket'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { ERROR_CODES } from 'App/utils/errorUtils'

export default class CoinMarketController {
  public async getCurrencies({ response }: HttpContextContract) {
    const currenciesInfo = await CoinMarketClient.getCurrenciesInfo()

    if (!currenciesInfo) {
      throw new Exception('Coin market error', 400, ERROR_CODES.COIN_MARKET_SERVER_ERROR)
    }

    return response.send(currenciesInfo.data)
  }
}
