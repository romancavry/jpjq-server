import Env from '@ioc:Adonis/Core/Env'

import * as https from 'https'
import * as http from 'http'

import axios, { type AxiosInstance } from 'axios'
import humps from 'humps'

import type ServiceConfig from 'App/Services/Client/Shared/ServiceConfig'

import { Currency } from 'App/Modules/currencies'

import endpoints from '../Shared/endpoints'

export default class CoinMarketClient {
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

  public async getCurrenciesInfo() {
    try {
      const response = await this.client.get(endpoints.v1_currencies, {
        params: {
          [Env.get('COIN_MARKET_API_KEY_PARAM')]: Env.get('COIN_MARKET_API_KEY'),
        },
      })

      return humps.camelizeKeys(response.data) as Promise<{
        data: Currency[]
        meta: { count: number }
      }>
    } catch (err) {
      console.log('v1/currencies error: ', err)
      return null
    }
  }
}
