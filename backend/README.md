# Backend - Maison Jungle

API Express + Prisma pour authentification, catalogue, panier et commandes.

## Architecture

- src/controllers: couche HTTP (req/res)
- src/services: logique metier et acces Prisma
- src/routes: declaration des endpoints
- src/middlewares: auth JWT + gestion d'erreurs
- prisma/: schema + seed

## Prerequis

- Node.js 20+
- npm
- PostgreSQL

## Installation

```bash
npm install
```

## Variables d'environnement

Copiez .env.example vers .env puis adaptez.

Exemple local:

```env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/maison_jungle
JWT_SECRET=change-this-secret
```

Note: en Docker Compose, DATABASE_URL est injecte automatiquement avec l'hote db:5432.

## Initialiser la base

```bash
npm run prisma:generate
npm run prisma:push
npm run db:seed
```

## Lancement local

```bash
npm run dev
```

API: http://localhost:4000/api

## Endpoints

Santé:

- GET /api/health

Catalogue:

- GET /api/plants?page=1&pageSize=6&search=mon&category=classique
- GET /api/categories

Auth:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Panier:

- GET /api/cart
- POST /api/cart/items
- PUT /api/cart/items/:plantId
- DELETE /api/cart/items/:plantId
- DELETE /api/cart

Commandes:

- POST /api/orders/checkout
- GET /api/orders
- PATCH /api/orders/:orderId/cancel

## Validation et securite

- validation des payloads avec Zod
- erreurs API normalisees via middleware central
- auth JWT (Bearer)
- mots de passe hashes avec bcrypt

## Tests

```bash
npm test
```

## Docker

Le dossier contient un Dockerfile de dev.

Important:

- .dockerignore exclut node_modules pour eviter les binaires natifs invalides entre Windows/Linux.
