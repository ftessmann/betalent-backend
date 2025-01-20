import type { HttpContext } from '@adonisjs/core/http'
import OrderService from '#services/order/order_service'
import { orderValidator } from '#validators/order_validator'

export default class OrderController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  public async store({ request, response }: HttpContext) {
    try {
      const payload = await orderValidator.validate(request.all())

      const result = await this.orderService.createOrder({
        name: payload.name,
        email: payload.email,
        amount: payload.amount,
        card_number: payload.card_number,
        cvv: payload.cvv,
      })

      return result
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}
