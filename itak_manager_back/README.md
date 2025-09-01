# ITAK Manager Backend

Backend NestJS pour l'application ITAK Manager avec intégration Supabase.

## 🚀 Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run start:dev

# Build de production
npm run build

# Démarrage en production
npm run start:prod
```

## 📡 API Endpoints

### Endpoints principaux

- `GET /api` - Statut de l'application
- `GET /api/health` - Santé du serveur

### Endpoints Supabase

- `GET /api/supabase/test` - Test de connexion Supabase
- `GET /api/supabase/tables` - Liste des tables
- `GET /api/supabase/data/:table` - Récupérer les données d'une table
- `POST /api/supabase/data/:table` - Insérer des données dans une table

## 🔧 Configuration

### Variables d'environnement

```bash
# Supabase
SUPABASE_URL=https://tuzdzcecnfouvywngiko.supabase.co
SUPABASE_ANON_KEY=votre_cle_api_ici

# Base de données
DATABASE_URL=postgresql://postgres:ITAK-DB-2025@db.tuzdzcecnfouvywngiko.supabase.co:5432/postgres

# Application
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

## 🏗️ Architecture

```
src/
├── config/                 # Configuration de l'application
│   ├── app.config.ts      # Configuration générale
│   ├── environment.config.ts # Variables d'environnement
│   └── supabase.config.ts # Configuration Supabase
├── controllers/           # Contrôleurs API
│   ├── app.controller.ts  # Contrôleur principal
│   └── supabase.controller.ts # Contrôleur Supabase
├── services/              # Services métier
│   ├── app.service.ts     # Service principal
│   └── supabase.service.ts # Service Supabase
├── modules/               # Modules NestJS
│   └── supabase.module.ts # Module Supabase
└── main.ts               # Point d'entrée
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests en mode watch
npm run test:watch

# Tests e2e
npm run test:e2e
```

## 📝 Scripts disponibles

- `npm run start` - Démarrage normal
- `npm run start:dev` - Démarrage avec hot reload
- `npm run start:debug` - Démarrage en mode debug
- `npm run start:prod` - Démarrage en production
- `npm run build` - Build de l'application
- `npm run format` - Formatage du code avec Prettier
- `npm run lint` - Vérification du code avec ESLint

## 🔗 Liens utiles

- [Documentation NestJS](https://docs.nestjs.com/)
- [Documentation Supabase](https://supabase.com/docs)
- [Interface Supabase](https://tuzdzcecnfouvywngiko.supabase.co)
