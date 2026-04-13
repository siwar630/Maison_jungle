# Maison Jungle

Monorepo full-stack avec:

- frontend React (catalogue, auth, panier, commandes)
- backend Node.js/Express + Prisma
- base PostgreSQL
- orchestration Docker Compose

## Structure

```text
Maison_jungle/
	frontend/
	backend/
	docker-compose.yml
```

## Nouveautes recentes

- UI/UX modernisee (layout plus clair, panneaux cote panier/commandes)
- gestion des commandes cote API et interface utilisateur
- endpoint de listing des commandes
- endpoint d'annulation de commande
- stack Docker stabilisee (images Linux propres via .dockerignore)

## Lancer avec Docker (recommande)

Depuis la racine du projet:

```bash
docker compose build --no-cache
docker compose up -d
```

Applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Healthcheck: http://localhost:4000/api/health

Arret:

```bash
docker compose down
```

## Lancer en local (sans Docker)

### 1) Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run db:seed
npm run dev
```

### 2) Frontend (2e terminal)

```bash
cd frontend
npm install
npm start
```

## Documentation detaillee

- backend: backend/README.md
- frontend: frontend/README.md

## Depannage rapide

- Si l'API ne repond pas en Docker: verifiez les logs avec `docker compose logs backend --tail 200`.
- Si `bcrypt_lib.node invalid ELF header`: rebuild sans cache (`docker compose build --no-cache`) puis relancez.
- Le message `[HMR] Waiting for update signal from WDS...` est normal en mode dev React.
