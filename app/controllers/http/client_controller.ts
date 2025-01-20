import Client from '#models/client'
import { clientValidator, updateClientValidator } from '#validators/client_validator'
import type { HttpContext } from '@adonisjs/core/http'

export default class ClientController {
  public async index({ response }: HttpContext) {
    const client = await Client.all()
    return response.ok(client)
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await clientValidator.validate(request.all())

      const client = new Client()
      client.email = payload.email
      client.name = payload.name

      await client.save()

      return response.created(client)
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
    const client = await Client.findOrFail(params.id)
    return response.ok(client)
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const payload = await updateClientValidator.validate(request.all())
      const client = await Client.findOrFail(params.id)

      client.merge(payload)

      await client.save()

      return response.ok(client)
    } catch (error) {
      return response.unprocessableEntity({ errors: error.messages })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    const client = await Client.findOrFail(params.id)
    await client.delete()

    return response.noContent()
  }
}
