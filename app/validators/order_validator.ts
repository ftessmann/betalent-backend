import vine from '@vinejs/vine'

export const orderValidator = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
    amount: vine.number().positive(),
    card_number: vine.string().minLength(16).maxLength(16),
    cvv: vine.string().minLength(3).maxLength(3),
  })
)
