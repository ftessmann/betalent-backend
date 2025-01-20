import type { HttpContext } from '@adonisjs/core/http'
import Transaction from '#models/transaction'
import { transactionValidator } from '#validators/transaction_validator'
import TransactionProduct from '#models/transaction_product'
import Gateway1Service from '#services/gateway/gateway1_service'
import Gateway2Service from '#services/gateway/gateway2_service'

type TransactionStatus = 'pending' | 'completed' | 'failed'
type TransactionPayload = {
  client_id: number
  gateway_id: number
  external_id?: string
  status: TransactionStatus
  amount: number
  card_last_numbers?: string
  products: Array<{
    product_id: number
    quantity: number
  }>
}

export default class TransactionController {
  async index({ request }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const transactions = await Transaction.query()
      .preload('client')
      .preload('gateway')
      .preload('transactionProducts')
      .paginate(page, limit)

    return transactions
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = (await transactionValidator.validate(request.all())) as TransactionPayload

      const transaction = await Transaction.create({
        clientId: payload.client_id,
        gatewayId: payload.gateway_id,
        externalId: payload.external_id,
        status: payload.status as TransactionStatus,
        amount: payload.amount,
        cardLastNumbers: payload.card_last_numbers,
      })

      if (payload.products && payload.products.length > 0) {
        const transactionProducts = payload.products.map((product) => ({
          transactionId: transaction.id,
          productId: product.product_id,
          quantity: product.quantity,
        }))

        await TransactionProduct.createMany(transactionProducts)
      }

      await transaction.refresh()
      await transaction.load('client')
      await transaction.load('gateway')
      await transaction.load('transactionProducts')

      return response.status(201).json(transaction)
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async show({ params, response }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)

      await transaction.load('client')
      await transaction.load('gateway')
      await transaction.load('transactionProducts')

      return response.json(transaction)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Transaction not found',
      })
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)
      const payload = (await transactionValidator.validate(request.all())) as TransactionPayload

      await transaction
        .merge({
          status: payload.status as TransactionStatus,
          gatewayId: payload.gateway_id,
          externalId: payload.external_id,
        })
        .save()

      if (payload.products) {
        await TransactionProduct.query().where('transaction_id', transaction.id).delete()

        const transactionProducts = payload.products.map((product) => ({
          transactionId: transaction.id,
          productId: product.product_id,
          quantity: product.quantity,
        }))

        await TransactionProduct.createMany(transactionProducts)
      }

      await transaction.load('client')
      await transaction.load('gateway')
      await transaction.load('transactionProducts')

      return response.json(transaction)
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async destroy({ params, response }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)

      await TransactionProduct.query().where('transaction_id', transaction.id).delete()

      await transaction.delete()

      return response.status(204)
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Transaction not found',
      })
    }
  }

  async refund({ params, response }: HttpContext) {
    try {
      const transaction = await Transaction.findOrFail(params.id)
      await transaction.load('gateway')

      if (transaction.status !== 'completed') {
        return response.status(400).json({
          success: false,
          message: 'Only completed transactions can be refunded',
        })
      }

      const gatewayService =
        transaction.gateway.name === 'gateway1' ? new Gateway1Service() : new Gateway2Service()

      const refundResult = await gatewayService.processRefund(transaction.externalId!)

      if (refundResult.success) {
        await transaction.merge({ status: 'refunded' }).save()
        return response.json({
          success: true,
          message: 'Refund processed successfully',
        })
      }

      return response.status(400).json({
        success: false,
        message: refundResult.error || 'Refund failed',
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getByClient({ params, response }: HttpContext) {
    try {
      const transactions = await Transaction.query()
        .where('clientId', params.clientId)
        .preload('client')
        .preload('gateway')
        .preload('transactionProducts')

      return response.json(transactions)
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }

  async getByStatus({ params, response }: HttpContext) {
    try {
      const transactions = await Transaction.query()
        .where('status', params.status)
        .preload('client')
        .preload('gateway')
        .preload('transactionProducts')

      return response.json(transactions)
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: error.message,
      })
    }
  }
}
