# 🏡 Maison Jungle - Fullstack DevOps Project

## 🚀 Overview
Maison Jungle is a fullstack e-commerce style application for plant shopping, built with React, Node.js, PostgreSQL, Docker, and a CI pipeline using GitHub Actions.
## 📸 Screenshot

![Maison Jungle app screenshot](homeJungle.png)

---
The project includes:

- Authentication with JWT
- Plants catalogue (search, category filter, pagination)
- Cart management
- Order checkout and order management (list + cancel)
- Dockerized development environment

---

## 🧱 Architecture

```text
Frontend (React)
		|
		v
Backend (Node.js / Express)
		|
		v
Database (PostgreSQL via Prisma)
```

Project layout:

```text
Maison_jungle/
	frontend/
	backend/
	docker-compose.yml
	.github/workflows/ci.yml
```

---

## 🐳 Docker Setup

Run from project root:

```bash
docker compose up --build
```

Services:

- frontend (http://localhost:3000)
- backend (http://localhost:4000/api)
- database (PostgreSQL on localhost:5433)

Stop services:

```bash
docker compose down
```

---

## 🔁 CI/CD Pipeline

GitHub Actions workflow automatically:

- ✔ install backend dependencies
- ✔ run backend tests
- ✔ run backend build step placeholder
- ✔ install frontend dependencies
- ✔ build frontend

Trigger:

- push on master
- pull requests

Workflow file:

- .github/workflows/ci.yml

---

## ⚙️ Environment Variables

Backend .env (local example):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/maison_jungle
JWT_SECRET=your_secret
PORT=4000
```

Frontend .env:

```env
REACT_APP_API_URL=http://localhost:4000/api
```

---

## 📊 Features

- User authentication (JWT)
- Plants and categories browsing
- Cart operations (add, update quantity, remove, clear)
- Checkout workflow
- Order management (view orders, cancel placed order)
- PostgreSQL database with Prisma ORM
- Dockerized environment
- CI pipeline with GitHub Actions

---

## 🧪 Tech Stack

- React
- Node.js
- Express
- PostgreSQL
- Prisma
- Docker
- GitHub Actions

---

## 🚀 How To Run Locally

```bash
git clone <repo-url>
cd Maison_jungle
docker compose up --build
```

Alternative without Docker:

1. Start backend in backend/
2. Start frontend in frontend/

Detailed setup:

- backend docs: backend/README.md
- frontend docs: frontend/README.md

---





## 👨‍💻 Author

Siwar TERRES
---

## 🔥 Project Value (CV / Portfolio)

- Dockerized fullstack app
- CI pipeline with GitHub Actions
- PostgreSQL + Prisma backend
- End-to-end feature flow (auth, cart, checkout, orders)
