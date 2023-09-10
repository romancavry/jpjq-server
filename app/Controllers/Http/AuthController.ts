import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(5)]),
    })

    const data = await request.validate({ schema: userSchema })
    const user = await User.create(data)

    await auth.login(user)

    return response.send(user)
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { username, password } = request.only(['username', 'password'])

    // const email = request.input('email')
    // const password = request.input('password')

    const user = await User.query().where('username', username).firstOrFail()

    // Verify password
    if (!(await Hash.verify(user.password, password))) {
      return response.badRequest('Invalid credentials')
    }

    await auth.use('web').login(user, true)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.status(200)
  }
}
