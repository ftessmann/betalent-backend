import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Client from './client.js'
import Gateway from './gateway.js'
import TransactionProduct from './transaction_product.js'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public clientId!: number

  @column()
  public gatewayId!: number

  @column()
  public externalId?: string

  @column()
  public amount!: number

  @column()
  public cardLastNumbers!: string

  @column()
  public status!: 'pending' | 'completed' | 'failed' | 'refunded'

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Client)
  public client!: BelongsTo<typeof Client>

  @belongsTo(() => Gateway)
  public gateway!: BelongsTo<typeof Gateway>

  @hasMany(() => TransactionProduct)
  public transactionProducts!: HasMany<typeof TransactionProduct>
}
