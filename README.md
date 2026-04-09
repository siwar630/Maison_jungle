# Maison Jungle - Monorepo simple Frontend/Backend

Le projet est maintenant organise en deux dossiers autonomes:

- `frontend/` : application React
- `backend/` : API Node.js/Express + Prisma + PostgreSQL

## Structure

```text
Maison_jungle/
	frontend/
	backend/
```

## Demarrage rapide

### 1) Lancer le backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```

### 2) Lancer le frontend (dans un 2e terminal)

```bash
cd frontend
npm install
npm start
```

## Documentation detaillee

- Voir `frontend/README.md` pour le front
- Voir `backend/README.md` pour le back
