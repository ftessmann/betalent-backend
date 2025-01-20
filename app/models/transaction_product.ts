import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Transaction from './transaction.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Product from './product.js'

export default class TransactionProduct extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public transactionId!: number

  @column()
  public productId!: number

  @column()
  public quantity!: number

  @column()
  public unitPrice!: number

  @column()
  public totalPrice!: number

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime

  @belongsTo(() => Transaction)
  public transaction!: BelongsTo<typeof Transaction>

  @belongsTo(() => Product)
  public product!: BelongsTo<typeof Product>
}
