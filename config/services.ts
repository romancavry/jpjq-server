import Env from '@ioc:Adonis/Core/Env'

import type ServiceConfig from 'App/Services/Client/Shared/ServiceConfig'

export const coinMarket: ServiceConfig = {
  baseUrl: Env.get('COIN_MARKET_BASE_URL'),
  timeout: Env.get('COIN_MARKET_TIMEOUT', 20_000),
  connectTimeout: Env.get('COIN_MARKET_CONNECT_TIMEOUT', 2_000),
  sslVerify: Env.get('COIN_MARKET_SSL_VERIFY', true),
}

export const cashMarket: ServiceConfig = {
  baseUrl: Env.get('CASH_MARKET_BASE_URL'),
  timeout: Env.get('CASH_MARKET_TIMEOUT', 20_000),
  connectTimeout: Env.get('CASH_MARKET_CONNECT_TIMEOUT', 2_000),
  sslVerify: Env.get('CASH_MARKET_SSL_VERIFY', true),
}
