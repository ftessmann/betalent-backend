import vine from '@vinejs/vine'

export const clientValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    email: vine.string().email().trim(),
  })
)

export const updateClientValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    email: vine.string().email().trim().optional(),
  })
)
