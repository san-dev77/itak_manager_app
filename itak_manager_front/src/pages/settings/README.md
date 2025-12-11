# Pages de Paramètres

Ce dossier contient toutes les pages de configuration et d'affectation du système Cyber School.

## Structure des Pages

### 1. SettingsPage.tsx

Page principale des paramètres avec un menu de navigation vers toutes les pages de configuration.

**Route :** `/settings`

### 2. StudentClassAssignmentPage.tsx

Gère l'affectation des élèves aux classes avec :

- Sélection d'un élève
- Sélection d'une classe
- Date de début (obligatoire)
- Date de fin (optionnelle)

**Route :** `/settings/student-class-assignment`

**Table correspondante :** `student_classes`

### 3. TeacherSubjectAssignmentPage.tsx

Gère l'affectation des enseignants aux matières avec :

- Sélection d'un enseignant
- Sélection d'une matière
- Vérification des doublons

**Route :** `/settings/teacher-subject-assignment`

**Table correspondante :** `teaching_assignments` (via `class_subjects`)

### 4. TeacherClassAssignmentPage.tsx

Gère l'affectation des enseignants aux classes avec :

- Sélection d'un enseignant
- Sélection d'une classe
- Date de début (obligatoire)
- Date de fin (optionnelle)

**Route :** `/settings/teacher-class-assignment`

**Table correspondante :** `teaching_assignments` (via `class_subjects`)

### 5. SubjectClassAssignmentPage.tsx

Gère l'affectation des matières aux classes avec :

- Sélection d'une classe
- Sélection d'une matière
- Coefficient (obligatoire)
- Heures hebdomadaires (obligatoire)
- Option matière optionnelle

**Route :** `/settings/subject-class-assignment`

**Table correspondante :** `class_subjects`

## Structure des Données

### Tables de Base

- `students` : Informations des élèves
- `teachers` : Informations des enseignants
- `classes` : Informations des classes
- `subjects` : Informations des matières

### Tables de Liaison

- `student_classes` : Affectation élèves-classes
- `class_subjects` : Affectation matières-classes (avec coefficient et heures)
- `teaching_assignments` : Affectation enseignants aux matières/classes

## Fonctionnalités

Chaque page inclut :

- Formulaire de création d'affectation
- Liste des affectations existantes
- Possibilité de suppression
- Validation des données
- Notifications de succès/erreur
- Interface responsive et moderne

## Utilisation

1. Accéder à `/settings` pour voir le menu principal
2. Cliquer sur l'option souhaitée pour accéder à la page de configuration
3. Utiliser le formulaire pour créer de nouvelles affectations
4. Consulter la liste des affectations existantes
5. Supprimer les affectations si nécessaire

## Notes Techniques

- Toutes les pages utilisent des composants UI réutilisables
- Les données sont actuellement mockées (à remplacer par des appels API)
- Interface TypeScript avec interfaces bien définies
- Gestion d'état locale avec React hooks
- Validation côté client des formulaires
