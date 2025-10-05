# Système de Calcul des Moyennes

Ce module implémente le calcul des moyennes scolaires avec distinction claire entre **coefficient** et **weight**.

## Concepts Clés

### 1. Coefficient (dans `class_subjects`)
- **Définition** : Multiplicateur fixe attribué à une matière pour toute une classe
- **Exemple** : Mathématiques = 4, Français = 3, Histoire = 2
- **Usage** : Défini une fois par an, reflète l'importance globale de la matière
- **Application** : Utilisé pour calculer la moyenne générale pondérée du trimestre/année

### 2. Weight (dans `assessments`)
- **Définition** : Multiplicateur variable attribué à une évaluation spécifique
- **Exemple** : Examen final = 2, Devoir maison = 1, Participation = 0.5
- **Usage** : Permet de différencier l'importance des évaluations au sein d'une même matière
- **Application** : Utilisé pour calculer la moyenne de la matière

## Exemple de Calcul Complet

### Matière : Mathématiques (coefficient = 4)

| Type d'évaluation | Weight | Note /20 |
|-------------------|--------|----------|
| Devoir surveillé 1 | 1 | 15 |
| Composition du trimestre | 2 | 12 |
| Participation | 0.5 | 18 |

**Calcul de la moyenne en Maths :**
```
Moyenne = (15×1 + 12×2 + 18×0.5) / (1 + 2 + 0.5)
        = (15 + 24 + 9) / 3.5
        = 48 / 3.5
        = 13.14/20
```

### Moyenne Générale du Trimestre

| Matière | Coefficient | Moyenne |
|---------|-------------|---------|
| Mathématiques | 4 | 13.14 |
| Français | 3 | 14.50 |
| Histoire | 2 | 16.00 |

**Calcul de la moyenne générale pondérée :**
```
Moyenne = (13.14×4 + 14.50×3 + 16.00×2) / (4 + 3 + 2)
        = (52.56 + 43.50 + 32.00) / 9
        = 128.06 / 9
        = 14.23/20
```

## API Endpoints

### Moyennes d'un étudiant pour un trimestre
```
GET /grade-calculation/student/:studentId/term/:termId
```

### Moyennes d'un étudiant pour une année
```
GET /grade-calculation/student/:studentId/year/:schoolYearId
```

### Moyennes de classe pour un trimestre
```
GET /grade-calculation/class/:classId/term/:termId/averages
```

## Structure des Réponses

### TermGradesResponseDto
```typescript
{
  termId: string;
  termName: string;
  studentId: string;
  subjects: [
    {
      classSubjectId: string;
      subjectName: string;
      coefficient: number; // Coefficient de la matière
      classworkAverage: number | null; // Moyenne devoirs (pondérée par weight)
      examAverage: number | null; // Moyenne examens (pondérée par weight)
      overallAverage: number | null; // Moyenne matière (pondérée par weight)
      totalAssessments: number;
      classworkCount: number;
      examCount: number;
    }
  ];
  overallAverage: number | null; // Moyenne simple du trimestre
  weightedAverage: number | null; // Moyenne pondérée par coefficients
}
```

## Types d'Évaluations

### Notes de Classe (classwork)
- `homework` - Devoirs à la maison
- `supervised_homework` - Devoirs surveillés
- `test` - Tests courts
- `quiz` - Quiz rapides
- `continuous_assessment` - Contrôle continu

### Notes d'Examens (exams)
- `exam` - Examens finaux
- `monthly_composition` - Compositions mensuelles

## Gestion des Absences

- **Présent** (`status = 'present'`) : Note réelle incluse dans le calcul
- **Absent** (`status = 'absent'`) : Note considérée comme 0/20 dans le calcul
- **Excusé** (`status = 'excused'`) : Note réelle incluse dans le calcul
- **Exclu** (`status = 'excluded'`) : Note considérée comme 0/20 dans le calcul
