import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Client from '#models/client'

export default class ClientSeeder extends BaseSeeder {
  public async run() {
    await Client.createMany([
      { name: 'João', email: 'joao@email.com' },
      { name: 'Maria', email: 'maria@email.com' },
      { name: 'Fernando', email: 'fernando@email.com' },
      { name: 'Fulano', email: 'fulano@email.com' },
    ])
  }
}
