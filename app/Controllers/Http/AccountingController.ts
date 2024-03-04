import type { DateTime } from 'luxon'

import { Exception } from '@adonisjs/core/build/standalone'

import CashMarketClient from '@ioc:App/Services/Client/CashMarket'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

import Transaction from 'App/Models/Transaction'

import { ERROR_CODES } from 'App/Utils/errorUtils'

export default class AccountingController {
  /**
   * Создание транзакции
   */
  public async createTransaction({ auth, request, response }: HttpContextContract) {
    try {
      const { slug, amount, buyPriceRub, buyDate } = await request.validate({
        schema: schema.create({
          slug: schema.string({ trim: true }),
          amount: schema.number(),
          buyPriceRub: schema.number(),
          buyDate: schema.string(),
        }),
        messages: {
          required: 'Поле {{ field }} обязательно для заполнения',
        },
      })

      const buyDateUsdCourse = await CashMarketClient.getHistorical({ date: buyDate })

      if (!buyDateUsdCourse) {
        throw new Exception('Cash market error', 400, ERROR_CODES.CASH_MARKET_SERVER_ERROR)
      }

      /**
       * Курс RUB к USD на момент покупки валюты
       */
      const buyDateUsdPrice = buyDateUsdCourse.data[buyDate]['RUB']

      /**
       * Сумма покупки валюты в долларах
       */
      const buyPriceUsd = buyPriceRub / buyDateUsdPrice

      /**
       * Средняя цена покупки валюты в USD
       */
      const averageBuyPriceUsd = buyPriceUsd / amount

      const createdTransaction = await Transaction.create({
        userId: auth.user!.id,
        coinSlug: slug,
        averagePrice: averageBuyPriceUsd,
        buyDate: buyDate as unknown as DateTime,
      })

      return response.json({ data: createdTransaction })
    } catch (err) {
      console.log(err)

      throw new Exception(
        err.message || 'Accounting controller createTransaction error',
        500,
        ERROR_CODES.CREATE_TRANSACTIONS_UNWISHED_ERROR
      )
    }
  }

  /**
   * Получение транзакций
   */
  public async getTransactions({ auth, response }: HttpContextContract) {
    try {
      const transactions = await Transaction.query().where('user_id', auth.user?.id!)

      return response.json({ data: transactions })
    } catch (err) {
      console.log(err)

      throw new Exception(
        err.message || 'Accounting controller getTransactions error',
        500,
        ERROR_CODES.CREATE_TRANSACTIONS_UNWISHED_ERROR
      )
    }
  }
}
