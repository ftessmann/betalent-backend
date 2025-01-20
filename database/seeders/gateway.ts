import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Gateway from '#models/gateway'

export default class GatewaySeeder extends BaseSeeder {
  public async run() {
    await Gateway.createMany([
      {
        name: 'gateway1',
        isActive: true,
      },
      {
        name: 'gateway2',
        isActive: true,
      },
    ])
  }
}
