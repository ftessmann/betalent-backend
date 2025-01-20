import vine from '@vinejs/vine'

export const productValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    amount: vine.number().withoutDecimals().positive(),
  })
)

export const updateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    amount: vine.number().withoutDecimals().positive().optional(),
  })
)
