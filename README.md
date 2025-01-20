# BeTalent Back-end Test

## Requerimentos
- Node.js 20.x
- MySQL 8.0
- Git
- Docker e Docker Compose (para instalação via Docker)

## Rodando o projeto

### Utilizando Docker Compose

#### 1 - Clonar repositório 
```bash
git clone https://github.com/ftessmann/betalent-backend
cd betalent-backend
```

#### 2 - Criar e iniciar containers
```bash
docker-compose up -d --build
```

#### 3 - Executar migrações e seeders
```bash
docker-compose exec app node ace migration:fresh
docker-compose exec app node ace db:seed
```

A aplicação ficará disponivel nas seguintes portas:
- API: localhost:3333
- Gateway 1: localhost:3001
- Gateway 2: localhost:3002
- DB: localhost:3306

Todas as variaveis de ambiente estão configuradas no docker-compose-yml

### Instalação local (sem Docker)

#### 1 - Clonar repositório 
```bash
git clone https://github.com/ftessmann/betalent-backend
cd betalent-backend
```

#### 2 - Instalar dependencias
```bash
npm install
```

#### 3 - Criar .env
```bash
cp .env.example .env
```

#### 4 - Configurar variaveis de ambiente no .env
```text
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=qPGUlLUZJoKXIIzrG61YFHWEW_VtL-vw
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=betalent
DB_DATABASE=betalentdb

LOGIN_EMAIL=dev@betalent.tech
LOGIN_TOKEN=FEC9BB078BF338F464F96B48089EB498

GATEWAY_AUTH_TOKEN=tk_f2198cc671b5289fa856
GATEWAY_AUTH_SECRET=3d15e8ed6131446ea7e3456728b1211f
```

#### 5 - Instalar e configurar MySQL
- Instalar MySQL 8.0
- Criar banco de dados:
```sql
CREATE DATABASE betalentdb
```

#### 6 - Rodar os mocks dos gateways
```bash
docker run -p 3001:3001 -p 3002:3002 -e REMOVE_AUTH=true matheusprotzen/gateways-mock
```

#### 7 - Rodar migrações e seeders
```bash
node ace migration:fresh
node ace db:seed
```

#### 8 - Iniciar a aplicação
```bash
node ace serve --watch
```

## Principais rotas do projeto

### /orders
POST - cria uma ordem de pagamento para os gateways
```json
{
    "name": "João",
    "email": "joao@email.com",
    "amount": 1000,
    "card_number": "4683568723416809",
    "cvv": "123"
}
```
Irá criar um client com name e email fornecidos caso não exista.

### /products
GET - lista todos produtos

POST - cria um novo produto
```json
{
    "name": "Product Name",
    "amount": 1000
}
```

Cria um novo produto com nome e valor.

### /products/:id
PUT - atualiza o produto
```json
{
    "name": "Updated Product Name",
    "amount": 5000
}
```

Atualiza nome do produto e valor

### /products/:id/purchase
POST - cria uma transação com um produto
```json
{
    "product_id": 3,
    "quantity": 4,
    "name": "Fernando",
    "email": "fernando@email.com",
    "card_number": "4683568723416809",
    "cvv": "123"
}
```
Criará uma transação com o id do produto informado, calculando o valor da transação baseado no valor do produto e quantidade de produtos informada. Quando success = true, obtem a seguinte resposta:
```json
{
    "success": true,
    "order": {
        "transaction": {
            "success": true,
            "transaction": {
                "clientId": 3,
                "amount": 12000,
                "cardLastNumbers": "6809",
                "status": "completed",
                "createdAt": "2025-01-20T21:02:45.400+00:00",
                "updatedAt": "2025-01-20T21:02:46.554+00:00",
                "id": 2,
                "gatewayId": 1,
                "externalId": "7439ee16-3e7e-45bd-bf39-b0657895bd4f"
            }
        },
        "details": {
            "product": "Product 3",
            "quantity": 4,
            "unit_price": "3000.00",
            "total_amount": 12000
        }
    }
}
```

### /transactions/client/:id
GET - Mostra todas as transações realizadas por um cliente, tem a seguinte resposta:
```json
[
    {
        "id": 1,
        "clientId": 3,
        "gatewayId": 1,
        "externalId": "09e5b70a-2d1a-4779-ad26-f33481ad4163",
        "amount": "2000.00",
        "status": "completed",
        "cardLastNumbers": "6063",
        "createdAt": "2025-01-20T17:49:40.000+00:00",
        "updatedAt": "2025-01-20T17:49:41.000+00:00",
        "client": {
            "id": 3,
            "name": "Fernando",
            "email": "fernando@email.com",
            "createdAt": "2025-01-20T17:44:41.000+00:00",
            "updatedAt": "2025-01-20T17:44:41.000+00:00"
        },
        "gateway": {
            "id": 1,
            "name": "gateway1",
            "isActive": 1,
            "priority": 2,
            "createdAt": "2025-01-20T17:44:41.000+00:00",
            "updatedAt": "2025-01-20T21:19:35.000+00:00"
        },
        "transactionProducts": []
    },
    {
        "id": 2,
        "clientId": 3,
        "gatewayId": 1,
        "externalId": "7439ee16-3e7e-45bd-bf39-b0657895bd4f",
        "amount": "12000.00",
        "status": "completed",
        "cardLastNumbers": "6063",
        "createdAt": "2025-01-20T21:02:45.000+00:00",
        "updatedAt": "2025-01-20T21:02:46.000+00:00",
        "client": {
            "id": 3,
            "name": "Fernando",
            "email": "fernando@email.com",
            "createdAt": "2025-01-20T17:44:41.000+00:00",
            "updatedAt": "2025-01-20T17:44:41.000+00:00"
        },
        "gateway": {
            "id": 1,
            "name": "gateway1",
            "isActive": 1,
            "priority": 2,
            "createdAt": "2025-01-20T17:44:41.000+00:00",
            "updatedAt": "2025-01-20T21:19:35.000+00:00"
        },
        "transactionProducts": []
    }
]
```

### /transactions/status/:status 
GET - Mostra as transações baseadas no status, completed || pending || failed || refunded, retorna um array com todas as transações com o status:
```json
[
    {
        "id": 5,
        "clientId": 3,
        "gatewayId": null,
        "externalId": null,
        "amount": "12000.00",
        "status": "failed",
        "cardLastNumbers": "6809",
        "createdAt": "2025-01-20T21:35:47.000+00:00",
        "updatedAt": "2025-01-20T21:35:47.000+00:00",
        "client": {
            "id": 3,
            "name": "Fernando",
            "email": "fernando@email.com",
            "createdAt": "2025-01-20T17:44:41.000+00:00",
            "updatedAt": "2025-01-20T17:44:41.000+00:00"
        },
        "transactionProducts": [],
        "gateway": null
    }
]
```

### /transactions/:id/refund
GET - Gera o refund da transação, somente transações com status completed podem ser revertidas, tem a seguinte resposta:
```json
{
    "success": true,
    "message": "Refund processed successfully"
}
```

### /gateway/:id/priority
PUT
```json
{
    "priority": 1
}
```
Altera a prioridade do gateway de pagamento

### /gateway/:id/toggle
POST - não é necessario corpo, ativa ou desativa o gateway fornecido, tem a seguinte resposta:
```json
{
    "success": true,
    "message": "Gateway deactivated successfully",
    "gateway": {
        "id": 1,
        "name": "gateway1",
        "isActive": false,
        "priority": null,
        "createdAt": "2025-01-20T17:44:41.000+00:00",
        "updatedAt": "2025-01-20T21:14:27.108+00:00"
    }
}
```

## Principais desafios do projeto
### Complexidade do sistema
Sistema com multiplas entidades interligadas onde se faz necessária a consistência em todas as operações, identificar regras de negocio mais complexas ainda é um pouco confuso para mim na hora de criar a aplicação.
### Docker
Minha primeira vez utilizando o Docker Compose, já havia criado outros projetos rodando apenas o DB em um container, mas pela primeira vez utilizando ele para rodar e criar o projeto.


## O que não foi implementado
Autenticação, roles e TDD.