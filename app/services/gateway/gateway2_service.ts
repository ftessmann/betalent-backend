/* eslint-disable prettier/prettier */
import axios from 'axios'
import BaseGatewayService, { GatewayTransaction, GatewayResponse } from './base_gateway_service.js'

export default class Gateway2Service extends BaseGatewayService {
  private headers: Record<string, string>
  constructor() {
    super('http://localhost:3002')
    this.headers = {
      'Gateway-Auth-Token': process.env.GATEWAY_AUTH_TOKEN ?? '',
      'Gateway-Auth-Secret': process.env.GATEWAY_AUTH_SECRET ?? '',
      'Content-Type': 'application/json',
    }

    if (!this.headers['Gateway-Auth-Token'] || !this.headers['Gateway-Auth-Secret']) {
      throw new Error('Missing required environment variables for gateway authentication.')
    }
  }

  public async processPayment(transaction: GatewayTransaction): Promise<GatewayResponse> {
    try {
      const payload = {
        valor: transaction.valor,
        nome: transaction.nome,
        email: transaction.email,
        numeroCartao: transaction.numeroCartao,
        cvv: transaction.cvv,
      }

      const response = await axios.post(
        `${this.baseUrl}/transacoes`,
        payload,
        { headers: this.headers },
      )
      console.log('Gateway2 Raw Response:', response.data)

      return {
        success: true,
        transactionId: response.data.id
      }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Gateway 2 error' }
    }
  }

  public async processRefund(transactionId: string): Promise<GatewayResponse> {
    try {
      const payload = { id: transactionId }
      await axios.post(
        `${this.baseUrl}/transacoes/reembolso`,
        payload,
        { headers: this.headers }
      )
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Refund failed' }
    }
  }

  public async getTransactions(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/transacoes`, { headers: this.headers })
      return response.data
    } catch (error) {
      return new Error('Failed to fetch transactions from gateway 2')
    }
  }
}
