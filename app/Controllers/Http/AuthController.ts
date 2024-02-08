import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Hash from '@ioc:Adonis/Core/Hash'

import UnAuthorized from 'App/Exceptions/UnAuthorizedException'

import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const userSchema = schema.create({
      username: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
      ]),
      password: schema.string({}, [rules.minLength(1)]),
    })

    const data = await request.validate({
      schema: userSchema,
      messages: {
        'required': 'Поле {{ field }} обязательно для заполнения',
        'username.unique': 'Имя пользователя должно быть уникально',
      },
    })
    const user = await User.create(data)

    await auth.login(user)

    return response.send(user)
  }

  public async login({ request, auth }: HttpContextContract) {
    const { username, password } = request.only(['username', 'password'])

    const user = await User.query().where('username', username).first()

    // Ensure user && verify password
    if (!user || !(await Hash.verify(user.password, password))) {
      throw new UnAuthorized('Invalid credentials', 400, 'INVALID_CREDENTIALS')
    }

    await auth.use('web').login(user, true)
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.use('web').logout()
    return response.status(200)
  }
}
