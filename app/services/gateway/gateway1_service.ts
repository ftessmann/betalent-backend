import axios from 'axios'
import BaseGatewayService from './base_gateway_service.js'
import { GatewayResponse, GatewayTransaction } from './base_gateway_service.js'

export default class Gateway1Service extends BaseGatewayService {
  private authToken: string | null = null

  constructor() {
    super('http://localhost:3001')
  }

  private async login(): Promise<void> {
    try {
      const response = await axios.post(`${this.baseUrl}/login`, {
        email: process.env.LOGIN_EMAIL,
        token: process.env.LOGIN_TOKEN,
      })

      this.authToken = response.data.token
    } catch (error) {
      throw new Error('Auth failed @ gateway 1')
    }
  }

  private async getHeaders(): Promise<Record<string, string>> {
    if (!this.authToken) {
      await this.login()
    }
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    }
  }

  public async processPayment(transaction: GatewayTransaction): Promise<GatewayResponse> {
    try {
      const headers = await this.getHeaders()
      const payload = {
        amount: transaction.valor,
        name: transaction.nome,
        email: transaction.email,
        cardNumber: transaction.numeroCartao,
        cvv: transaction.cvv,
      }

      const response = await axios.post(`${this.baseUrl}/transactions`, payload, { headers })
      console.log('Gateway1 Raw Response:', response.data)

      return {
        success: true,
        transactionId: response.data.id,
      }
    } catch (error) {
      console.error('Gateway1 Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
      if (error.response?.status === 401) {
        this.authToken = null
        return this.processPayment(transaction)
      }

      return {
        success: false,
        error: error.response?.data?.message || 'Gateway 1 error',
      }
    }
  }

  public async processRefund(transactionId: string): Promise<GatewayResponse> {
    try {
      const headers = await this.getHeaders()
      await axios.post(
        `${this.baseUrl}/transactions/${transactionId}/charge-back`,
        { id: transactionId },
        { headers }
      )
      return { success: true }
    } catch (error) {
      if (error.response?.status === 401) {
        this.authToken = null
        return this.processRefund(transactionId)
      }
      return {
        success: false,
        error: error.response?.data?.message || 'Refund failed',
      }
    }
  }

  public async getTransactions(): Promise<any> {
    try {
      const headers = await this.getHeaders()
      const response = await axios.get(`${this.baseUrl}/transactions`, { headers })
      return response.data
    } catch (error) {
      return new Error('Failed to fetch transactions from gateway 1')
    }
  }
}
