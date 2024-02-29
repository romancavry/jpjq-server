import Env from '@ioc:Adonis/Core/Env'

import * as https from 'https'
import * as http from 'http'

import axios, { type AxiosInstance } from 'axios'
import humps from 'humps'

import type ServiceConfig from 'App/Services/Client/Shared/ServiceConfig'

import endpoints from '../Shared/endpoints'

export default class CashMarketClient {
  private readonly baseUrl: string
  private readonly connectTimeout: number
  private readonly timeout: number
  private readonly client: AxiosInstance

  constructor(params: ServiceConfig) {
    this.baseUrl = params.baseUrl
    this.connectTimeout = params.connectTimeout
    this.timeout = params.timeout

    const httpAgent = new http.Agent({
      timeout: this.connectTimeout,
    })
    const httpsAgent = new https.Agent({
      timeout: this.connectTimeout,
      rejectUnauthorized: params.sslVerify,
    })

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      httpAgent: httpAgent,
      httpsAgent: httpsAgent,
      maxRedirects: 1,
      // headers: { 'X-Custom-header': '...' },
    })
  }

  public async getHistorical({ date }: { date: string }) {
    try {
      const response = await this.client.get(endpoints.v1_historical, {
        params: {
          [Env.get('CASH_MARKET_API_KEY_PARAM')]: Env.get('CASH_MARKET_API_KEY'),
          date,
        },
      })

      return humps.camelizeKeys(response.data) as Promise<{
        /**
         * {
         *  date: {
         *     "2024-02-28": {
         *        "RUB": 91.3951307443,
         *        "EUR": 0.9227801203,
         *        "USD": 1
         *      }
         *   }
         * }
         */
        data: Record<string, Record<string, number>>
      }>
    } catch (err) {
      console.log('Cash market getHistorical error: ', err)
      return null
    }
  }
}
