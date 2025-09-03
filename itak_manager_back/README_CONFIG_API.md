# API de Configuration ITAK Manager

## Vue d'ensemble

L'API de configuration regroupe tous les endpoints nécessaires pour gérer les relations entre les entités principales du système ITAK Manager. Elle est accessible via le préfixe `/api/config`.

## Structure des Endpoints

### 1. **Class Subjects** (`/api/config/class-subjects`)

Gère l'association entre les classes et les matières avec des informations sur les coefficients, heures hebdomadaires et statut optionnel.

### 2. **Student Classes** (`/api/config/student-classes`)

Gère l'inscription des étudiants dans les classes avec des dates de début et de fin.

### 3. **Teaching Assignments** (`/api/config/teaching-assignments`)

Gère l'assignation des professeurs aux classes-matières avec des dates de début et de fin.

## Endpoints Détaillés

### Class Subjects

#### Créer une association classe-matière

```http
POST /api/config/class-subjects
Content-Type: application/json

{
  "class_id": 1,
  "subject_id": 5,
  "coefficient": 3,
  "weekly_hours": 4,
  "is_optional": false
}
```

#### Récupérer toutes les associations

```http
GET /api/config/class-subjects
```

#### Récupérer une association par ID

```http
GET /api/config/class-subjects/:id
```

#### Récupérer les matières d'une classe

```http
GET /api/config/class-subjects/class/:classId
```

#### Récupérer les classes d'une matière

```http
GET /api/config/class-subjects/subject/:subjectId
```

#### Mettre à jour une association

```http
PUT /api/config/class-subjects/:id
Content-Type: application/json

{
  "coefficient": 5,
  "weekly_hours": 6
}
```

#### Supprimer une association

```http
DELETE /api/config/class-subjects/:id
```

### Student Classes

#### Créer une inscription étudiant-classe

```http
POST /api/config/student-classes
Content-Type: application/json

{
  "student_id": 9,
  "class_id": 1,
  "start_date": "2024-09-01",
  "end_date": null
}
```

#### Récupérer toutes les inscriptions

```http
GET /api/config/student-classes
```

#### Récupérer une inscription par ID

```http
GET /api/config/student-classes/:id
```

#### Récupérer les inscriptions d'un étudiant

```http
GET /api/config/student-classes/student/:studentId
```

#### Récupérer les étudiants d'une classe

```http
GET /api/config/student-classes/class/:classId
```

#### Mettre à jour une inscription

```http
PUT /api/config/student-classes/:id
Content-Type: application/json

{
  "end_date": "2025-06-30"
}
```

#### Supprimer une inscription

```http
DELETE /api/config/student-classes/:id
```

### Teaching Assignments

#### Créer une assignation professeur

```http
POST /api/config/teaching-assignments
Content-Type: application/json

{
  "teacher_id": 6,
  "class_subject_id": 9,
  "start_date": "2024-09-01",
  "end_date": null
}
```

#### Récupérer toutes les assignations

```http
GET /api/config/teaching-assignments
```

#### Récupérer une assignation par ID

```http
GET /api/config/teaching-assignments/:id
```

#### Récupérer les assignations d'un professeur

```http
GET /api/config/teaching-assignments/teacher/:teacherId
```

#### Récupérer les assignations d'une classe-matière

```http
GET /api/config/teaching-assignments/class-subject/:classSubjectId
```

#### Mettre à jour une assignation

```http
PUT /api/config/teaching-assignments/:id
Content-Type: application/json

{
  "end_date": "2025-06-30"
}
```

#### Supprimer une assignation

```http
DELETE /api/config/teaching-assignments/:id
```

## Validation des Données

### Class Subjects

- `class_id`: Doit être un nombre et correspondre à une classe existante
- `subject_id`: Doit être un nombre et correspondre à une matière existante
- `coefficient`: Doit être un nombre entre 0 et 10
- `weekly_hours`: Doit être un nombre entre 0 et 40 (optionnel)
- `is_optional`: Doit être un booléen (optionnel, défaut: false)

### Student Classes

- `student_id`: Doit être un nombre et correspondre à un étudiant existant
- `class_id`: Doit être un nombre et correspondre à une classe existante
- `start_date`: Doit être une date valide (pas dans le futur)
- `end_date`: Doit être une date valide après start_date (optionnel)

### Teaching Assignments

- `teacher_id`: Doit être un nombre et correspondre à un professeur existant
- `class_subject_id`: Doit être un nombre et correspondre à une association classe-matière existante
- `start_date`: Doit être une date valide (pas dans le futur)
- `end_date`: Doit être une date valide après start_date (optionnel)

## Contraintes Métier

### Class Subjects

- Une matière ne peut être associée qu'une seule fois à une classe
- Le coefficient doit être positif
- Les heures hebdomadaires doivent être positives si spécifiées

### Student Classes

- Un étudiant ne peut être inscrit qu'une seule fois dans une classe
- La date de début ne peut pas être dans le futur
- La date de fin doit être après la date de début

### Teaching Assignments

- Un professeur ne peut être assigné qu'une seule fois à une classe-matière
- La date de début ne peut pas être dans le futur
- La date de fin doit être après la date de début

## Gestion des Erreurs

L'API retourne des codes d'erreur HTTP appropriés :

- `400 Bad Request`: Données invalides ou contraintes non respectées
- `404 Not Found`: Ressource demandée non trouvée
- `409 Conflict`: Conflit avec une ressource existante
- `500 Internal Server Error`: Erreur interne du serveur

## Exemples de Réponses

### Class Subject Response

```json
{
  "id": 1,
  "class_id": 1,
  "subject_id": 5,
  "coefficient": 3,
  "weekly_hours": 4,
  "is_optional": false,
  "created_at": "2024-01-01T00:00:00Z",
  "class": {
    "id": 1,
    "name": "6ème A",
    "level": "6ème"
  },
  "subject": {
    "id": 5,
    "name": "Histoire",
    "code": "HIST"
  }
}
```

### Student Class Response

```json
{
  "id": 1,
  "student_id": 9,
  "class_id": 1,
  "start_date": "2024-09-01",
  "end_date": null,
  "created_at": "2024-01-01T00:00:00Z",
  "student": {
    "id": 9,
    "first_name": "Jean",
    "last_name": "Dupont"
  },
  "class": {
    "id": 1,
    "name": "6ème A",
    "level": "6ème"
  }
}
```

### Teaching Assignment Response

```json
{
  "id": 1,
  "teacher_id": 6,
  "class_subject_id": 9,
  "start_date": "2024-09-01",
  "end_date": null,
  "created_at": "2024-01-01T00:00:00Z",
  "teacher": {
    "id": 6,
    "first_name": "Marie",
    "last_name": "Martin"
  },
  "class_subject": {
    "id": 9,
    "class": {
      "id": 1,
      "name": "6ème A",
      "level": "6ème"
    },
    "subject": {
      "id": 5,
      "name": "Histoire",
      "code": "HIST"
    },
    "coefficient": 3,
    "weekly_hours": 4
  }
}
```

## Tests

Utilisez le fichier `test_config_api.http` pour tester tous les endpoints de l'API de configuration.

## Notes Importantes

1. **Ordre de création**: Créez d'abord les entités principales (classes, matières, étudiants, professeurs) avant d'utiliser l'API de configuration
2. **Intégrité référentielle**: La suppression d'une entité principale supprimera automatiquement toutes les relations associées
3. **Validation des dates**: Les dates de début ne peuvent pas être dans le futur
4. **Unicité**: Chaque combinaison unique est autorisée une seule fois
5. **Cascade**: Les suppressions en cascade maintiennent l'intégrité de la base de données
