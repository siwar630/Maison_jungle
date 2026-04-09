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
- GET /api/plants
- GET /api/categories
