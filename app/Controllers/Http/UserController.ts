import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  public async getUser({ auth, response }: HttpContextContract) {
    return response.send(auth.user)
  }
}
