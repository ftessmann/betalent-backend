import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Product from '#models/product'

export default class ProductSeeder extends BaseSeeder {
  public async run() {
    await Product.createMany([
      { name: 'Product 1', amount: 1000 },
      { name: 'Product 2', amount: 2000 },
      { name: 'Product 3', amount: 3000 },
      { name: 'Product 4', amount: 4000 },
    ])
  }
}
