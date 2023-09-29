import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import UnAuthorized from 'App/Exceptions/UnAuthorizedException'

export default class UserController {
  public async getUser({ auth, response }: HttpContextContract) {
    if (auth.user) {
      return response.send(auth.user)
    }

    throw new UnAuthorized('You are not authorized', 401, 'E_UNAUTHORIZED')
  }
}
