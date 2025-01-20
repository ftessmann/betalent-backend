import vine from '@vinejs/vine'

export const transactionProductValidator = vine.compile(
  vine.object({
    transaction_id: vine.number().withoutDecimals(),
    product_id: vine.number().withoutDecimals(),
    quantity: vine.number().withoutDecimals().positive(),
    unit_price: vine.number().positive(),
    total_price: vine.number().positive(),
  })
)
