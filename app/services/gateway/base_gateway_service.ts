export interface GatewayTransaction {
  valor: number
  nome: string
  email: string
  numeroCartao: string
  cvv: string
}

export interface GatewayResponse {
  success: boolean
  transactionId?: string
  error?: string
}

export default abstract class BaseGatewayService {
  protected baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  abstract processPayment(transaction: GatewayTransaction): Promise<GatewayResponse>
  abstract processRefund(transactionId: string): Promise<GatewayResponse>
  abstract getTransactions(): Promise<any>
}
