import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { createUserValidator, updateUserValidator } from '#validators/user_validator'

export default class UsersController {
  public async index({ response }: HttpContext) {
    const user = await User.all()
    return response.ok(user)
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await createUserValidator.validate(request.all())

      const user = new User()
      user.email = payload.email
      user.password = await hash.make(payload.password)
      user.role = payload.role

      await user.save()

      return response.created(user)
    } catch (error) {
      console.log('Validation error', error.messages)
      return response.unprocessableEntity({
        message: 'Validation failed',
        errors: error.messages,
        details: error,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return response.ok(user)
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await updateUserValidator.validate(request.all())
      const user = await User.findOrFail(params.id)

      if (payload.password) {
        payload.password = await hash.make(payload.password)
      }

      user.merge(payload)

      await user.save()

      return response.ok(user)
    } catch (error) {
      return response.unprocessableEntity({ errors: error.messages })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const user = await User.findOrFail(params.id)
    await user.delete()

    return response.noContent()
  }
}
