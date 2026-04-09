# Backend - Maison Jungle

API Node.js/Express avec Prisma ORM connectee a PostgreSQL.

## Prerequis

- Node.js 20+
- npm
- PostgreSQL (base `maison_jungle`)

## Installation

```bash
npm install
```

## Variables d'environnement

Copiez `.env.example` en `.env`:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/maison_jungle
JWT_SECRET=change-this-secret
```

## Initialiser la base

```bash
npm run prisma:generate
npm run prisma:push
npm run db:seed
```

## Lancement

```bash
npm run dev
```

API disponible sur http://localhost:4000

## Endpoints utiles

- GET /api/health
- GET /api/plants?page=1&pageSize=6&search=mon&category=classique
- GET /api/categories
- POST /api/auth/register
- POST /api/auth/login
- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:plantId
- DELETE /api/cart/items/:plantId
- DELETE /api/cart
- POST /api/orders/checkout

## Validation et erreurs

- Validation des payloads avec Zod
- Gestion d'erreurs centralisee (messages API coherents)

## Tests

```bash
npm test
```
