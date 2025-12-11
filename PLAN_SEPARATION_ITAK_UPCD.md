# Plan de Séparation ITAK / UPCD

## 📋 Vue d'ensemble

L'objectif est de distinguer et séparer deux parties de l'école :

- **ITAK** : Partie professionnelle (Lycée)
- **UPCD** : Partie université privée (Fac)

---

## 🎯 Phase 1 : Base de données et Backend

### 1.1 Création d'une entité `Institution` (ou utilisation de `ClassCategory`)

**Option A : Utiliser `ClassCategory` existante**

- Avantage : Déjà en place, liée aux classes
- Inconvénient : Ne couvre pas directement les étudiants/enseignants/staff

**Option B : Créer une nouvelle entité `Institution`**

- Avantage : Plus explicite, peut être étendue plus tard
- Structure proposée :
  ```typescript
  enum InstitutionType {
    ITAK = "itak", // Lycée professionnel
    UPCD = "upcd", // Université privée
  }
  ```

**Recommandation : Option B** pour plus de flexibilité

### 1.2 Modification des entités principales

#### 1.2.1 Entité `Student`

- Ajouter champ `institutionId: string` (nullable pour migration)
- Relation `@ManyToOne(() => Institution)`
- Index sur `institutionId`

#### 1.2.2 Entité `Teacher`

- Ajouter champ `institutionId: string` (nullable)
- Relation `@ManyToOne(() => Institution)`
- Index sur `institutionId`

#### 1.2.3 Entité `Staff`

- Ajouter champ `institutionId: string` (nullable)
- Relation `@ManyToOne(() => Institution)`
- Index sur `institutionId`

#### 1.2.4 Entité `Class` (déjà liée à `ClassCategory`)

- S'assurer que `ClassCategory` peut distinguer ITAK/UPCD
- Ou ajouter `institutionId` directement

### 1.3 Migration de base de données

1. Créer migration pour :

   - Table `institutions` avec valeurs par défaut (ITAK, UPCD)
   - Ajouter colonne `institution_id` aux tables `students`, `teachers`, `staff`
   - Migrer les données existantes (assigner à ITAK par défaut)
   - Rendre `institution_id` NOT NULL après migration

2. Créer migration pour `ClassCategory` :
   - S'assurer que les catégories existantes sont liées à une institution
   - Ou créer des catégories ITAK/UPCD

### 1.4 Modification des DTOs

#### Backend DTOs à modifier :

- `CreateStudentDto` : Ajouter `institutionId?: string` (requis si non défini)
- `UpdateStudentDto` : Ajouter `institutionId?: string`
- `CreateTeacherDto` : Ajouter `institutionId?: string`
- `UpdateTeacherDto` : Ajouter `institutionId?: string`
- `CreateStaffDto` : Ajouter `institutionId?: string`
- `UpdateStaffDto` : Ajouter `institutionId?: string`

### 1.5 Modification des Services Backend

#### Services à modifier :

- `student.service.ts` :
  - Filtrer par `institutionId` dans `findAll()`, `findOne()`
  - Valider `institutionId` dans `create()`, `update()`
- `teacher.service.ts` :
  - Filtrer par `institutionId` dans `findAll()`, `findOne()`
  - Valider `institutionId` dans `create()`, `update()`
- `staff.service.ts` :
  - Filtrer par `institutionId` dans `findAll()`, `findOne()`
  - Valider `institutionId` dans `create()`, `update()`

#### Nouveaux endpoints (optionnel) :

- `GET /api/institutions` : Liste des institutions
- `GET /api/students?institutionId=xxx` : Filtrer par institution
- `GET /api/teachers?institutionId=xxx` : Filtrer par institution
- `GET /api/staff?institutionId=xxx` : Filtrer par institution

---

## 🎨 Phase 2 : Frontend

### 2.1 Gestion du contexte d'institution

#### 2.1.1 Créer un contexte React `InstitutionContext`

- État global pour l'institution sélectionnée
- Provider au niveau de l'application
- Hook `useInstitution()` pour accéder au contexte

#### 2.1.2 Sélecteur d'institution

- Composant dans le `Topbar` ou `Sidebar`
- Permet de basculer entre ITAK et UPCD
- Persiste la sélection (localStorage)

### 2.2 Modification de la navigation (Sidebar)

#### Structure proposée :

```
📁 ITAK (Lycée)
  ├─ Tableau de bord ITAK
  ├─ Étudiants ITAK
  ├─ Enseignants ITAK
  ├─ Personnel ITAK
  ├─ Classes ITAK
  └─ ...

📁 UPCD (Université)
  ├─ Tableau de bord UPCD
  ├─ Étudiants UPCD
  ├─ Enseignants UPCD
  ├─ Personnel UPCD
  ├─ Classes UPCD
  └─ ...
```

**Options d'implémentation :**

**Option A : Menu avec sections pliables**

- Sections ITAK et UPCD avec `ChevronDown/ChevronUp`
- Sous-menus pour chaque section
- Badge indiquant le nombre d'éléments

**Option B : Onglets dans la page**

- Menu principal reste global
- Onglets ITAK/UPCD dans chaque page (StudentsPage, etc.)
- Filtrage automatique selon l'onglet

**Option C : Routes séparées**

- `/itak/students`, `/itak/teachers`, etc.
- `/upcd/students`, `/upcd/teachers`, etc.
- Sidebar adapte les liens selon l'institution

**Recommandation : Option B + Option C combinées**

- Routes séparées pour la clarté
- Onglets pour basculer rapidement

### 2.3 Modification des formulaires

#### 2.3.1 `StudentFormModal`

- Ajouter champ sélecteur `institution` (requis)
- Valeur par défaut selon le contexte

#### 2.3.2 `TeacherFormModal`

- Ajouter champ sélecteur `institution` (requis)

#### 2.3.3 `StaffFormModal`

- Ajouter champ sélecteur `institution` (requis)

### 2.4 Modification des pages principales

#### 2.4.1 `StudentsPage.tsx`

- Ajouter onglets ITAK / UPCD
- Filtrer les données selon l'onglet actif
- Passer `institutionId` aux API calls
- Afficher badge avec nombre d'étudiants par institution

#### 2.4.2 Pages similaires pour Teachers et Staff

- Même logique d'onglets et filtrage

### 2.5 Modification des services API

#### `api.ts` :

- Ajouter interface `Institution`
- Modifier `StudentProfileData`, `TeacherProfileData`, `StaffProfileData` :
  - Ajouter `institutionId: string`
- Modifier les appels API pour inclure `institutionId` dans les queries

### 2.6 Schémas de validation (Zod)

#### `student.schema.ts` :

- Ajouter `institutionId: z.string().uuid()`

#### `teacher.schema.ts` :

- Ajouter `institutionId: z.string().uuid()`

#### `staff.schema.ts` :

- Ajouter `institutionId: z.string().uuid()`

---

## 🔄 Phase 3 : Migration des données existantes

### 3.1 Script de migration

1. Créer les institutions ITAK et UPCD dans la base
2. Assigner tous les étudiants existants à ITAK (ou selon logique métier)
3. Assigner tous les enseignants existants à ITAK
4. Assigner tout le personnel existant à ITAK
5. Vérifier l'intégrité des données

### 3.2 Gestion des classes

- Déterminer quelles classes appartiennent à ITAK vs UPCD
- Mettre à jour `ClassCategory` en conséquence
- Ou créer de nouvelles catégories si nécessaire

---

## 📊 Phase 4 : Améliorations et optimisations

### 4.1 Permissions par institution

- Les utilisateurs peuvent avoir accès à une ou plusieurs institutions
- Table `user_institutions` (Many-to-Many)
- Vérification des permissions dans les services

### 4.2 Statistiques séparées

- Dashboard ITAK vs UPCD
- Rapports financiers séparés
- Statistiques d'inscription par institution

### 4.3 Export/Import séparés

- Export Excel par institution
- Import avec validation de l'institution

---

## 📝 Checklist d'implémentation

### Backend

- [ ] Créer entité `Institution`
- [ ] Ajouter `institutionId` à `Student`, `Teacher`, `Staff`
- [ ] Créer migration de base de données
- [ ] Modifier DTOs (Create/Update)
- [ ] Modifier services (filtrage, validation)
- [ ] Ajouter endpoints de filtrage (optionnel)
- [ ] Tester les modifications

### Frontend

- [ ] Créer `InstitutionContext` et hook `useInstitution`
- [ ] Créer composant sélecteur d'institution
- [ ] Modifier `Sidebar` avec sections ITAK/UPCD
- [ ] Modifier routes pour inclure `/itak/` et `/upcd/`
- [ ] Ajouter onglets dans `StudentsPage`, `TeachersPage`, `StaffPage`
- [ ] Modifier formulaires (ajouter champ institution)
- [ ] Modifier services API (ajouter `institutionId`)
- [ ] Modifier schémas Zod
- [ ] Tester l'interface

### Migration

- [ ] Créer script de migration des données
- [ ] Tester la migration sur une copie de la base
- [ ] Exécuter la migration en production
- [ ] Vérifier l'intégrité des données

---

## 🚀 Ordre d'implémentation recommandé

1. **Backend - Entités et Migration** (Phase 1.1 à 1.3)
2. **Backend - Services et DTOs** (Phase 1.4 à 1.5)
3. **Frontend - Contexte et sélecteur** (Phase 2.1)
4. **Frontend - Navigation** (Phase 2.2)
5. **Frontend - Formulaires** (Phase 2.3)
6. **Frontend - Pages principales** (Phase 2.4)
7. **Migration des données** (Phase 3)
8. **Tests et ajustements** (Phase 4)

---

## ⚠️ Points d'attention

1. **Compatibilité ascendante** : Les données existantes doivent être migrées proprement
2. **Performance** : Les index sur `institutionId` sont essentiels
3. **UX** : Le basculement entre ITAK/UPCD doit être fluide
4. **Sécurité** : Vérifier que les utilisateurs ne peuvent accéder qu'aux institutions autorisées
5. **Validation** : S'assurer qu'un étudiant/enseignant/staff ne peut pas être créé sans institution

---

## 📌 Questions à clarifier

1. Un utilisateur peut-il appartenir aux deux institutions (ITAK et UPCD) ?
2. Les classes doivent-elles être strictement séparées ou peuvent-elles être partagées ?
3. Les enseignants peuvent-ils enseigner dans les deux institutions ?
4. Y a-t-il des données partagées (ex: finances, calendrier) ou tout est séparé ?
5. Faut-il un super-admin qui voit tout, ou chaque admin ne voit que son institution ?

---

## 🎨 Mockup de la navigation proposée

```
┌─────────────────────────────────┐
│  UPCD-ITAK                      │
│  [ITAK ▼] [UPCD]                │ ← Sélecteur
├─────────────────────────────────┤
│  📊 Tableau de bord              │
│  👥 Utilisateurs                 │
│                                  │
│  📁 ITAK (Lycée)        [▼]     │
│    ├─ 📚 Étudiants ITAK          │
│    ├─ 👨‍🏫 Enseignants ITAK        │
│    ├─ 💼 Personnel ITAK          │
│    └─ 📖 Classes ITAK            │
│                                  │
│  📁 UPCD (Université)   [▼]     │
│    ├─ 📚 Étudiants UPCD          │
│    ├─ 👨‍🏫 Enseignants UPCD        │
│    ├─ 💼 Personnel UPCD          │
│    └─ 📖 Classes UPCD            │
│                                  │
│  📅 Calendrier                  │
│  💰 Finances                    │
│  ⚙️  Paramètres                  │
└─────────────────────────────────┘
```

---

**Date de création** : 2025-01-27
**Version** : 1.0
