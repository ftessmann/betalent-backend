import type { HttpContext } from '@adonisjs/core/http'
import Gateway from '#models/gateway'
import { gatewayValidator, updateGatewayValidator } from '#validators/gateway_validator'
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'

type GatewayPayload = {
  name: string
  is_active: boolean
}

export default class GatewayController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const gateways: ModelPaginatorContract<Gateway> = await Gateway.query().paginate(page, limit)

    return gateways
  }

  async store({ request }: HttpContext) {
    const payload = (await gatewayValidator.validate(request.all())) as GatewayPayload

    const gateway = await Gateway.create(payload)
    await gateway.refresh()

    return gateway
  }

  async show({ params }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    return gateway
  }

  async update({ params, request }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    const payload = (await gatewayValidator.validate(request.all())) as GatewayPayload

    await gateway.merge(payload).save()
    return gateway
  }

  async destroy({ params }: HttpContext) {
    const gateway = await Gateway.findOrFail(params.id)
    await gateway.delete()

    return { message: 'Gateway deleted successfully' }
  }

  async toggleActive({ params, response }: HttpContext) {
    try {
      const gateway = await Gateway.findOrFail(params.id)
      gateway.isActive = !gateway.isActive
      await gateway.save()

      return response.json({
        success: true,
        message: `Gateway ${gateway.isActive ? 'activated' : 'deactivated'} successfully`,
        gateway,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async updatePriority({ params, request, response }: HttpContext) {
    try {
      const gateway = await Gateway.findOrFail(params.id)
      const payload = await updateGatewayValidator.validate(request.all())

      if (payload.priority === undefined) {
        return response.status(400).json({
          success: false,
          message: 'Priority is required',
        })
      }

      const existingGateway = await Gateway.findBy('priority', payload.priority)

      if (existingGateway) {
        existingGateway.priority = gateway.priority ?? 0
        await existingGateway.save()
      }

      gateway.priority = payload.priority as number
      await gateway.save()

      return response.json({
        success: true,
        message: 'Gateway priority updated successfully',
        gateway,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}
