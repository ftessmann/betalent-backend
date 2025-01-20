import vine from '@vinejs/vine'

export const purchaseValidator = vine.compile(
  vine.object({
    product_id: vine.number().withoutDecimals(),
    quantity: vine.number().withoutDecimals().positive(),
    name: vine.string().minLength(3),
    email: vine.string().email(),
    card_number: vine.string().minLength(16).maxLength(16),
    cvv: vine.string().minLength(3).maxLength(4),
  })
)
