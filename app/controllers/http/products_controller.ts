import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import { productValidator } from '#validators/product_validator'
import OrderService from '#services/order/order_service'
import { purchaseValidator } from '#validators/purchase_validator'

type ProductPayload = {
  name: string
  amount: number
}

export default class ProductController {
  private orderService: OrderService

  constructor() {
    this.orderService = new OrderService()
  }

  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const products = await Product.query().paginate(page, limit)

    return products
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = (await productValidator.validate(request.all())) as ProductPayload

      const product = await Product.create(payload)
      await product.refresh()

      return response.status(201).json({
        success: true,
        product,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      return response.json(product)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const payload = (await productValidator.validate(request.all())) as ProductPayload

      await product.merge(payload).save()

      return response.json({
        success: true,
        product,
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      await product.delete()

      return response.status(204)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }
  }

  async purchase({ request, response }: HttpContext) {
    try {
      const payload = await purchaseValidator.validate(request.all())

      const product = await Product.findOrFail(payload.product_id)

      const totalAmount = product.amount * payload.quantity

      const orderData = {
        name: payload.name,
        email: payload.email,
        amount: totalAmount,
        card_number: payload.card_number,
        cvv: payload.cvv,
        products: [
          {
            product_id: product.id,
            quantity: payload.quantity,
            unit_price: product.amount,
            total_price: totalAmount,
          },
        ],
      }

      console.log('Purchase Data:', {
        product: product.name,
        quantity: payload.quantity,
        unitPrice: product.amount,
        totalAmount,
      })

      const result = await this.orderService.createOrder(orderData)

      return response.status(201).json({
        success: true,
        order: {
          transaction: result,
          details: {
            product: product.name,
            quantity: payload.quantity,
            unit_price: product.amount,
            total_amount: totalAmount,
          },
        },
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}
