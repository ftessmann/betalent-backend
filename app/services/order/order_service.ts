import Transaction from '#models/transaction'
import Gateway from '#models/gateway'
import Gateway1Service from '#services/gateway/gateway1_service'
import Gateway2Service from '#services/gateway/gateway2_service'
import { GatewayTransaction } from '#services/gateway/base_gateway_service'
import { CreateTransactionData, OrderData } from '#types/index'
import Client from '#models/client'

export default class OrderService {
  public async createOrder(orderData: OrderData) {
    const client = await Client.firstOrCreate(
      { email: orderData.email },
      { name: orderData.name, email: orderData.email }
    )

    const transactionData: CreateTransactionData = {
      client_id: client.id,
      amount: orderData.amount,
      card_last_numbers: orderData.card_number.slice(-4),
      status: 'pending',
    }

    const transaction = await Transaction.create(transactionData)

    const paymentData: GatewayTransaction = {
      valor: orderData.amount,
      nome: orderData.name,
      email: orderData.email,
      numeroCartao: orderData.card_number,
      cvv: orderData.cvv,
    }

    return this.processPayment(transaction, paymentData)
  }
  private async getActiveGateways() {
    const gateways = await Gateway.query().where('isActive', true).orderBy('priority', 'asc')
    console.log('Found gateways:', gateways)

    return gateways.map((gateway) => ({
      id: gateway.id,
      service: gateway.name === 'gateway1' ? new Gateway1Service() : new Gateway2Service(),
    }))
  }

  public async processPayment(transaction: Transaction, paymentData: GatewayTransaction) {
    const activeGateways = await this.getActiveGateways()

    console.log('Active Gateways:', activeGateways)
    console.log('Payment Data:', paymentData)

    for (const gateway of activeGateways) {
      try {
        console.log(`Attempting payment with gateway ${gateway.id}`)

        const response = await gateway.service.processPayment(paymentData)
        console.log('Gateway Response:', response)

        if (response.success) {
          await transaction
            .merge({
              gatewayId: gateway.id,
              externalId: response.transactionId,
              status: 'completed',
            })
            .save()

          return { success: true, transaction }
        } else {
          console.log(`Gateway ${gateway.id} failed:`, response.error)
        }
      } catch (error) {
        console.error('Detailed Error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        })
        console.error(`Gateway ${gateway.id} error:`, error.response?.data || error.message)
      }
    }

    await transaction.merge({ status: 'failed' }).save()

    throw new Error('Payment processing failed on all gateways')
  }
}
