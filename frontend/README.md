# Frontend - Maison Jungle

Application React (catalogue + auth + panier connecte a l'API backend).

## Prerequis

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Variables d'environnement

Copiez `.env.example` en `.env` puis adaptez si besoin:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

## Lancement

```bash
npm start
```

Application disponible sur http://localhost:3000

## Fonctionnalites front

- Authentification JWT (inscription/connexion)
- Catalogue avec pagination + recherche + filtre categorie
- Panier synchronise via API (plus de localStorage panier)
- Checkout via backend

## Tests

```bash
npm test -- --watchAll=false
```

## Build production

```bash
npm run build
```
