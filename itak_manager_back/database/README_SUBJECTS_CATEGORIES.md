# Gestion des Matières avec Catégories

## Vue d'ensemble

Les matières (subjects) sont maintenant organisées par catégories, similaire à la gestion des classes. Chaque matière doit appartenir à une catégorie existante.

## Structure de la base de données

### Table `subjects`

- `id`: Identifiant unique (SERIAL PRIMARY KEY)
- `name`: Nom de la matière (VARCHAR(50) NOT NULL)
- `code`: Code unique de la matière (VARCHAR(10) UNIQUE NOT NULL)
- `categorie_id`: ID de la catégorie (INTEGER NOT NULL, FK vers class_category)
- `created_at`: Date de création (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)

### Contraintes

- Clé étrangère vers `class_category(id)` avec suppression en cascade
- Index sur `categorie_id` pour améliorer les performances

## Migration

Si vous avez une table `subjects` existante, exécutez le script de migration :

```sql
-- Exécuter le fichier migrate_subjects_add_category.sql
```

## API Endpoints

### Créer une matière

```http
POST /api/subjects
Content-Type: application/json

{
  "name": "Mathématiques",
  "code": "MATH",
  "categorie_id": 1
}
```

### Récupérer toutes les matières

```http
GET /api/subjects
```

### Récupérer une matière par ID

```http
GET /api/subjects/:id
```

### Récupérer une matière par code

```http
GET /api/subjects/code/:code
```

### Récupérer des matières par nom

```http
GET /api/subjects/name/:name
```

### Récupérer des matières par catégorie

```http
GET /api/subjects/category/:categoryId
```

### Mettre à jour une matière

```http
PUT /api/subjects/:id
Content-Type: application/json

{
  "name": "Mathématiques Avancées",
  "categorie_id": 2
}
```

### Supprimer une matière

```http
DELETE /api/subjects/:id
```

## Validation

- Le nom doit contenir au moins 2 caractères
- Le code doit contenir au moins 2 caractères
- L'ID de la catégorie doit être un nombre valide
- La catégorie doit exister dans la table `class_category`
- Le code doit être unique
- Le nom doit être unique

## Relations

Chaque matière est liée à une catégorie via `categorie_id`. Les informations de la catégorie sont incluses dans les réponses de l'API :

```json
{
  "id": 1,
  "name": "Mathématiques",
  "code": "MATH",
  "categorie_id": 1,
  "created_at": "2024-01-01T00:00:00Z",
  "category": {
    "id": 1,
    "name": "Sciences Fondamentales"
  }
}
```

## Exemples d'utilisation

### Créer une matière de mathématiques

```json
{
  "name": "Algèbre",
  "code": "ALG",
  "categorie_id": 1
}
```

### Créer une matière d'histoire

```json
{
  "name": "Histoire Moderne",
  "code": "HIST_MOD",
  "categorie_id": 2
}
```

## Notes importantes

1. **Assurez-vous que les catégories existent** avant de créer des matières
2. **Le code de la matière doit être unique** dans toute la base de données
3. **La suppression d'une catégorie** supprimera automatiquement toutes les matières associées
4. **Utilisez les IDs de catégorie existants** lors de la création de matières
