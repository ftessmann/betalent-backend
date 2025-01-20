import vine from '@vinejs/vine'

export const transactionValidator = vine.compile(
  vine.object({
    client_id: vine.number().withoutDecimals(),
    gateway_id: vine.number().withoutDecimals(),
    external_id: vine.string().optional(),
    status: vine.string().in(['pending', 'completed', 'failed', 'refunded']),
    amount: vine.number().withoutDecimals().positive(),
    card_last_numbers: vine.string().maxLength(4).optional(),
    products: vine.array(
      vine.object({
        product_id: vine.number().withoutDecimals(),
        quantity: vine.number().withoutDecimals().positive(),
      })
    ),
  })
)
