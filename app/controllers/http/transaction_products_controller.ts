import type { HttpContext } from '@adonisjs/core/http'
import TransactionProduct from '#models/transaction_product'
import { transactionProductValidator } from '#validators/transaction_product_validator'

type TransactionProductPayload = {
  transaction_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
}

export default class TransactionProductsController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const transactionProducts = await TransactionProduct.query()
      // @ts-expect-error
      .preload('transaction')
      .preload('product')
      .paginate(page, limit)

    return transactionProducts
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = (await transactionProductValidator.validate(
        request.all()
      )) as TransactionProductPayload

      const transactionProduct = await TransactionProduct.create({
        transactionId: payload.transaction_id,
        productId: payload.product_id,
        quantity: payload.quantity,
        unitPrice: payload.unit_price,
        totalPrice: payload.total_price,
      })

      await transactionProduct.refresh()
      // @ts-expect-error
      await transactionProduct.load('transaction')
      await transactionProduct.load('product')

      return response.status(201).json({
        success: true,
        transactionProduct,
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
      const transactionProduct = await TransactionProduct.findOrFail(params.id)
      // @ts-expect-error
      await transactionProduct.load('transaction')
      await transactionProduct.load('product')

      return response.json(transactionProduct)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Transaction product not found',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const transactionProduct = await TransactionProduct.findOrFail(params.id)
      const payload = (await transactionProductValidator.validate(
        request.all()
      )) as TransactionProductPayload

      await transactionProduct
        .merge({
          transactionId: payload.transaction_id,
          productId: payload.product_id,
          quantity: payload.quantity,
          unitPrice: payload.unit_price,
          totalPrice: payload.total_price,
        })
        .save()
      // @ts-expect-error
      await transactionProduct.load('transaction')
      await transactionProduct.load('product')

      return response.json({
        success: true,
        transactionProduct,
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
      const transactionProduct = await TransactionProduct.findOrFail(params.id)
      await transactionProduct.delete()

      return response.status(204)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Transaction product not found',
      })
    }
  }
}
