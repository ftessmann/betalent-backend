import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(6),
    role: vine.string().in(['admin', 'user']),
  })
)

export const updateUserValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().optional(),
    password: vine.string().minLength(6).optional(),
    role: vine.string().in(['admin', 'user']).optional(),
  })
)
