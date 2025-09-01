# Configuration Supabase pour NestJS

## Étapes de configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine de votre projet avec :

```bash
# Supabase Configuration
SUPABASE_URL=https://tuzdzcecnfouvywngiko.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1emR6Y2VjbmZvdXZ5d25naWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NTQxNDEsImV4cCI6MjA3MjIzMDE0MX0.lLvwkCBSxZ2TdxY7Wcj8-A4dBmv2Jcec0Kc6qgTyvIs

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.tuzdzcecnfouvywngiko.supabase.co:5432/postgres
```

### 2. Récupérer votre clé API Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet
4. Allez dans **Settings** > **API**
5. Copiez la **anon public** key

### 3. Tester la connexion

Une fois configuré, testez avec :

```bash
# Démarrer le serveur
npm run start:dev

# Tester l'endpoint
curl http://localhost:3000/api/supabase/test
```

### 4. Endpoints disponibles

- `GET /api/supabase/test` - Test de connexion
- `GET /api/supabase/tables` - Liste des tables
- `GET /api/supabase/data/:table` - Récupérer les données d'une table
- `POST /api/supabase/data/:table` - Insérer des données dans une table

### 5. Structure des fichiers

```
src/
├── config/
│   ├── environment.config.ts    # Configuration d'environnement
│   └── supabase.config.ts      # Configuration Supabase
├── services/
│   └── supabase.service.ts     # Service Supabase
├── controllers/
│   └── supabase.controller.ts  # Contrôleur API
└── modules/
    └── supabase.module.ts      # Module Supabase
```

### 6. Utilisation dans vos services

```typescript
import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Injectable()
export class MonService {
  constructor(private supabaseService: SupabaseService) {}

  async getUsers() {
    return await this.supabaseService.getData('users');
  }
}
```
