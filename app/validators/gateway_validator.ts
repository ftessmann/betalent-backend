import vine from '@vinejs/vine'

export const gatewayValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    is_active: vine.boolean(),
    priority: vine.number().withoutDecimals(),
  })
)

export const updateGatewayValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    is_active: vine.boolean().optional(),
    priority: vine.number().withoutDecimals().optional(),
  })
)
