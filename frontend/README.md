# Frontend - Maison Jungle

Application React connectee a l'API backend.

## Prerequis

- Node.js 20+
- npm

## Installation

```bash
npm install
```

## Variables d'environnement

Copiez .env.example en .env:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

## Lancement

```bash
npm start
```

Application: http://localhost:3000

## Fonctionnalites

- auth complete (inscription, connexion, session)
- catalogue (recherche, filtre categorie, pagination)
- panier temps reel (ajout, suppression, quantite, clear)
- checkout
- panneau Mes commandes:
	- liste des commandes utilisateur
	- detail des articles
	- statut des commandes
	- annulation d'une commande placee

## UX/UI

- layout modernise avec colonne laterale
- panneau panier + panneau commandes
- feedback utilisateur plus clair (loading, erreurs, actions)
- design responsive desktop/mobile

## Scripts utiles

```bash
npm test -- --watchAll=false
npm run build
```

## Notes dev

- Le message `[HMR] Waiting for update signal from WDS...` est normal en mode developpement.
