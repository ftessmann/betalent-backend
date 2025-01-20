import router from '@adonisjs/core/services/router'

const ProductController = () => import('#controllers/http/products_controller')
const TransactionController = () => import('#controllers/http/transactions_controller')
const TransactionProductsController = () =>
  import('#controllers/http/transaction_products_controller')
const OrderController = () => import('#controllers/http/order_controller')
const UsersController = () => import('#controllers/http/users_controller')
const ClientController = () => import('#controllers/http/client_controller')
const GatewayController = () => import('#controllers/http/gateways_controller')

router.post('/orders', [OrderController, 'store'])

router.group(() => {
  router.get('/users', [UsersController, 'index'])
  router.post('/users', [UsersController, 'store'])
  router.get('/users/:id', [UsersController, 'show'])
  router.put('/users/:id', [UsersController, 'update'])
  router.delete('/users/:id', [UsersController, 'destroy'])
})

router.group(() => {
  router.get('/clients', [ClientController, 'index'])
  router.post('/clients', [ClientController, 'store'])
  router.get('/clients/:id', [ClientController, 'show'])
  router.put('/clients/:id', [ClientController, 'update'])
  router.delete('/clients/:id', [ClientController, 'destroy'])
})

router.group(() => {
  router.get('/products', [ProductController, 'index'])
  router.post('/products', [ProductController, 'store'])
  router.get('/products/:id', [ProductController, 'show'])
  router.put('/products/:id', [ProductController, 'update'])
  router.delete('/products/:id', [ProductController, 'destroy'])
  router.post('products/:id/purchase', [ProductController, 'purchase'])
})

router.group(() => {
  router.get('/transactions', [TransactionController, 'index'])
  router.post('/transactions', [TransactionController, 'store'])
  router.get('/transactions/:id', [TransactionController, 'show'])
  router.put('/transactions/:id', [TransactionController, 'update'])
  router.delete('/transactions/:id', [TransactionController, 'destroy'])
  router.get('/transactions/:id/refund', [TransactionController, 'refund'])
  router.get('/transactions/client/:clientId', [TransactionController, 'getByClient'])
  router.get('/transactions/status/:status', [TransactionController, 'getByStatus'])
})

router.group(() => {
  router.get('/transaction-products', [TransactionProductsController, 'index'])
  router.post('/transaction-products', [TransactionProductsController, 'store'])
  router.get('/transaction-products/:id', [TransactionProductsController, 'show'])
  router.put('/transaction-products/:id', [TransactionProductsController, 'update'])
  router.delete('/transaction-products/:id', [TransactionProductsController, 'destroy'])
})

router.group(() => {
  router.get('/gateway', [GatewayController, 'index'])
  router.post('/gateway', [GatewayController, 'store'])
  router.get('/gateway/:id', [GatewayController, 'show'])
  router.put('/gateway/:id', [GatewayController, 'update'])
  router.delete('/gateway/:id', [GatewayController, 'destroy'])
  router.post('/gateway/:id/toggle', [GatewayController, 'toggleActive'])
  router.put('/gateway/:id/priority', [GatewayController, 'updatePriority'])
})
