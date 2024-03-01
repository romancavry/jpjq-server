/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // Создание транзакции
  Route.post('/accounting/create', 'AccountingController.createTransaction')

  // Получение информации о конкретной валюте по ее slug
  Route.get('/crypto/currencies', 'CryptoController.getCurrenciesCollection')

  // Получение всей коллекции валюты
  Route.get('/crypto/currency', 'CryptoController.getCurrencyInfo')
}).middleware('auth:web')

Route.group(() => {
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')
  Route.get('/logout', 'AuthController.logout')

  Route.get('/user', 'UserController.getUser')
}).prefix('auth')
