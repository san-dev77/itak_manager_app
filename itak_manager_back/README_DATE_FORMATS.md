# Formats de Dates Acceptés - API de Configuration ITAK Manager

## Vue d'ensemble

L'API de configuration accepte les dates sous plusieurs formats pour offrir une flexibilité maximale aux développeurs frontend et aux intégrations.

## Formats Acceptés

### 1. **Format String ISO (Recommandé)**

```json
{
  "start_date": "2024-09-01",
  "end_date": "2025-06-30"
}
```

### 2. **Format String avec Heure**

```json
{
  "start_date": "2024-09-01T00:00:00.000Z",
  "end_date": "2025-06-30T23:59:59.999Z"
}
```

### 3. **Format String Français**

```json
{
  "start_date": "01/09/2024",
  "end_date": "30/06/2025"
}
```

### 4. **Format String Anglais**

```json
{
  "start_date": "09/01/2024",
  "end_date": "06/30/2025"
}
```

### 5. **Format Date Object (JavaScript)**

```javascript
// Dans le code JavaScript/TypeScript
const data = {
  start_date: new Date('2024-09-01'),
  end_date: new Date('2025-06-30'),
};
```

## Exemples d'Utilisation

### **Class Subjects** - Pas de dates

```json
{
  "class_id": 1,
  "subject_id": 5,
  "coefficient": 3,
  "weekly_hours": 4,
  "is_optional": false
}
```

### **Student Classes** - Avec dates

```json
{
  "student_id": 9,
  "class_id": 1,
  "start_date": "2024-09-01",
  "end_date": "2025-06-30"
}
```

### **Teaching Assignments** - Avec dates

```json
{
  "teacher_id": 6,
  "class_subject_id": 9,
  "start_date": "2024-09-01",
  "end_date": "2025-06-30"
}
```

## Validation Automatique

### **Transformation des Types**

- Les dates sont automatiquement transformées en chaînes lors de la validation
- Le décorateur `@Type(() => String)` assure la cohérence des types

### **Validation des Dates**

- `@IsDateString()` vérifie que la chaîne est une date valide
- Les dates invalides génèrent une erreur 400 Bad Request

### **Validation Métier**

- Les dates de début ne peuvent pas être dans le futur
- Les dates de fin doivent être après les dates de début
- Les dates undefined sont autorisées pour les champs optionnels

## Utilitaires de Date

### **Fonctions Disponibles**

```typescript
import {
  normalizeDate,
  toDate,
  isValidDate,
  isFutureDate,
  isEndDateAfterStartDate,
} from '../utils/date.utils';

// Normaliser une date
const normalizedDate = normalizeDate('2024-09-01');

// Convertir en objet Date
const dateObject = toDate('2024-09-01');

// Vérifier la validité
const isValid = isValidDate('2024-09-01');

// Vérifier si c'est une date future
const isFuture = isFutureDate('2024-09-01');

// Vérifier l'ordre des dates
const isCorrectOrder = isEndDateAfterStartDate('2024-09-01', '2025-06-30');
```

## Bonnes Pratiques

### **1. Format Recommandé**

```json
{
  "start_date": "2024-09-01" // YYYY-MM-DD
}
```

### **2. Gestion des Erreurs**

```typescript
try {
  const response = await api.post('/config/student-classes', data);
} catch (error) {
  if (error.response?.status === 400) {
    // Erreur de validation des dates
    console.log('Format de date invalide');
  }
}
```

### **3. Validation Côté Client**

```typescript
// Vérifier avant l'envoi
const isValidStartDate = isValidDate(formData.start_date);
const isValidEndDate = isValidDate(formData.end_date);

if (!isValidStartDate || !isValidEndDate) {
  alert('Format de date invalide');
  return;
}
```

## Formats Supportés par le Navigateur

### **Chrome, Firefox, Safari, Edge**

- `YYYY-MM-DD` ✅
- `YYYY-MM-DDTHH:mm:ss.sssZ` ✅
- `MM/DD/YYYY` ✅
- `DD/MM/YYYY` ✅
- `MM-DD-YYYY` ✅
- `DD-MM-YYYY` ✅

### **Format Universellement Supporté**

```json
{
  "start_date": "2024-09-01" // YYYY-MM-DD
}
```

## Migration et Compatibilité

### **Ancien Format (String uniquement)**

```typescript
// ✅ Toujours valide
start_date: string;
```

### **Nouveau Format (String | Date)**

```typescript
// ✅ Plus flexible
start_date: string | Date;
```

### **Rétrocompatibilité**

- Tous les anciens appels API continuent de fonctionner
- Les nouveaux formats sont automatiquement supportés
- Aucune modification côté client n'est requise

## Tests

### **Test avec cURL**

```bash
# Format ISO
curl -X POST http://localhost:3000/api/config/student-classes \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 9,
    "class_id": 1,
    "start_date": "2024-09-01",
    "end_date": "2025-06-30"
  }'

# Format avec heure
curl -X POST http://localhost:3000/api/config/student-classes \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": 9,
    "class_id": 1,
    "start_date": "2024-09-01T00:00:00.000Z",
    "end_date": "2025-06-30T23:59:59.999Z"
  }'
```

### **Test avec JavaScript**

```javascript
// Test des différents formats
const testDates = [
  '2024-09-01',
  '2024-09-01T00:00:00.000Z',
  '09/01/2024',
  '01/09/2024',
  new Date('2024-09-01'),
];

testDates.forEach((date) => {
  console.log(`Date: ${date}, Valide: ${isValidDate(date)}`);
});
```

## Support et Dépannage

### **Erreurs Communes**

1. **400 Bad Request** : Format de date invalide
2. **400 Bad Request** : Date de début dans le futur
3. **400 Bad Request** : Date de fin avant date de début

### **Solutions**

1. Vérifier le format de la date
2. Utiliser le format YYYY-MM-DD
3. Vérifier la logique métier des dates

### **Contact**

Pour toute question sur les formats de dates, consultez la documentation de l'API ou contactez l'équipe de développement.
