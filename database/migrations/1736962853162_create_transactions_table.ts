import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('client_id').unsigned().references('id').inTable('clients').notNullable
      table.integer('gateway_id').unsigned().references('id').inTable('gateways').nullable()
      table.string('external_id')
      table.decimal('amount', 10, 2).notNullable()
      table.string('status').checkIn(['pending', 'completed', 'failed', 'refunded'])
      table.string('card_last_numbers').notNullable
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
