export interface OrderData {
  name: string
  email: string
  amount: number
  card_number: string
  cvv: string
}

export interface CreateTransactionData {
  client_id: number
  amount: number
  card_last_numbers: string
  gateway_id?: number
  external_id?: string
  status: 'pending' | 'completed' | 'failed'
}
