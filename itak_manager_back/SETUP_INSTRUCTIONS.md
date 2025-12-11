# 🚀 Instructions de Configuration - ITAK Manager Backend

## 📋 Vue d'ensemble

## j'ai du mettre quelques routes en public car mon token n'etait pas validé par le backend

Headers envoyés:
{Content-Type: 'application/json', Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdW…c1Nn0.Vawqi9Agl6Z*-7a_RtigJkYZlD8abJ63G9TYLvRU_nk'}
Authorization
:
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzYWQzMWI5NC03NGI0LTQ1NWUtODVhMi1hZjllYTA2ZWNlOTUiLCJlbWFpbCI6InRlc3RAbWFpbC5jb20iLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc1OTQ0NTc1Nn0.Vawqi9Agl6Z*-7a_RtigJkYZlD8abJ63G9TYLvRU_nk"

l'erreur afffichait : 401 unauthorized...

## ⚠️ Problèmes connus après clone Git

- ❌ Configuration CORS non configurée
- ❌ Configuration Swagger non activée
- ❌ Erreurs dans les services (Student, Staff, Class) car les relations ne sont pas chargés
- ❌ Problèmes d'authentification

---

## 🔧 **ÉTAPE 1 : Configuration de base de données**

### 1.1 Créer le fichier `.env`

Créez un fichier `.env` à la racine du projet (à côté de `package.json`) :

```env
# Database Configuration
DB_URL=postgresql://postgres:root@localhost:5432/itak_manager
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=root
DB_NAME=itak_manager
DB_SSL=false

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=24h

# Redis Configuration (if needed)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Configuration (if needed)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# CORS Configuration
FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:3000
```

### 1.2 Vérifier PostgreSQL

Assurez-vous que PostgreSQL est installé et que :

- Le serveur PostgreSQL est démarré
- L'utilisateur `postgres` existe avec le mot de passe `root`
- La base de données `itak_manager` existe (ou sera créée par les migrations)

---

## 🔧 **ÉTAPE 2 : Configuration CORS et Swagger**

### 2.1 Modifier `src/main.ts`

Remplacez complètement le contenu de `src/main.ts` :

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './docs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get('app.frontendUrl') || 'http://localhost:5173';

  // Configuration CORS
  app.enableCors({
    origin: [
      frontendUrl,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
  });

  // Configuration Swagger
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

### 2.2 Modifier `src/docs/swagger.ts`

Remplacez complètement le contenu de `src/docs/swagger.ts` :

```typescript
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('ITAK Manager API')
    .setDescription(
      "API de gestion scolaire ITAK Manager - Système complet de gestion d'établissement scolaire",
    )
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: "Entrez votre token JWT d'accès",
    })
    .addServer(configService.get('app.url') || 'http://localhost:3000')
    .addServer('http://localhost:3000')
    .addTag('Auth', 'Authentification et gestion des tokens')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Students', 'Gestion des étudiants')
    .addTag('Teachers', 'Gestion des enseignants')
    .addTag('Staff', 'Gestion du personnel administratif')
    .addTag('Parents', 'Gestion des parents')
    .addTag('Classes', 'Gestion des classes')
    .addTag('Subjects', 'Gestion des matières')
    .addTag('Assessments', 'Gestion des évaluations')
    .addTag('Payments', 'Gestion des paiements')
    .addTag('Invoices', 'Gestion des factures')
    .addTag('Events', 'Gestion des événements')
    .addTag('Timetables', 'Gestion des emplois du temps')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  });
}
```

---

## 🔧 **ÉTAPE 3 : Corrections des services**

### 3.1 Corriger `src/modules/auth/auth.service.ts`

Dans la méthode `validateUser`, supprimez les logs de débogage et gardez seulement :

```typescript
// Vérifier le mot de passe
const isPasswordValid = await bcrypt.compare(password, user.password);

if (!isPasswordValid) {
  return null;
}
```

### 3.2 Corriger `src/modules/user/dto/user.dto.ts`

Dans la classe `CreateUserDto`, ajoutez le champ password :

```typescript
@IsOptional()
@IsString({ message: 'Le mot de passe doit être une chaîne' })
password?: string;
```

### 3.3 Corriger `src/modules/user/user.service.ts`

Dans la méthode `createUser`, remplacez :

```typescript
const password = Utils.generateRandomString(10);
```

Par :

```typescript
// Utiliser le mot de passe fourni ou générer un mot de passe aléatoire
const password = createUserDto.password || Utils.generateRandomString(10);
```

### 3.4 Corriger `src/modules/student/student.service.ts`

Dans la méthode `createStudent`, remplacez :

```typescript
const savedStudent = await this.studentRepository.save(student);
return this.mapToStudentResponseDto(savedStudent);
```

Par :

```typescript
const savedStudent = await this.studentRepository.save(student);

// Récupérer l'étudiant avec la relation user chargée
const studentWithUser = await this.studentRepository.findOne({
  where: { id: savedStudent.id },
  relations: ['user'],
});

if (!studentWithUser) {
  throw new Error("Erreur lors de la récupération de l'étudiant créé");
}

return this.mapToStudentResponseDto(studentWithUser);
```

Dans la méthode `mapToStudentResponseDto`, remplacez :

```typescript
user: {
  id: student.user.id,
  // ... autres propriétés
},
```

Par :

```typescript
user: student.user ? {
  id: student.user.id,
  username: student.user.username,
  email: student.user.email,
  firstName: student.user.firstName,
  lastName: student.user.lastName,
  gender: student.user.gender,
  birthDate: student.user.birthDate,
  phone: student.user.phone,
  role: student.user.role,
  isActive: student.user.isActive,
  createdAt: student.user.createdAt,
  updatedAt: student.user.updatedAt,
} : undefined,
```

### 3.5 Corriger `src/modules/staff/staff.service.ts`

Appliquez les mêmes corrections que pour `StudentService` :

- Charger la relation `user` après sauvegarde
- Ajouter une vérification de sécurité dans `mapToStaffResponseDto`

### 3.6 Corriger `src/modules/class/class.service.ts`

Dans la méthode `createClass`, remplacez :

```typescript
const classEntity = this.classRepository.create(createClassDto);
```

Par :

```typescript
// Créer l'entité avec le mapping correct
const classEntity = this.classRepository.create({
  name: createClassDto.name,
  code: createClassDto.code,
  categoryId: createClassDto.classCategoryId, // Mapping correct
  description: createClassDto.description,
  level: createClassDto.level,
  capacity: createClassDto.capacity,
  orderLevel: createClassDto.orderLevel,
});
```

---

## 🔧 **ÉTAPE 4 : Installation et démarrage**

### 4.1 Installer les dépendances

```bash
npm install
```

### 4.2 Exécuter les migrations

```bash
# Windows PowerShell
$env:DB_PASSWORD="root"; npm run migration:run

# Linux/Mac
DB_PASSWORD=root npm run migration:run
```

### 4.3 Démarrer l'application

```bash
# Windows PowerShell
$env:DB_PASSWORD="root"; npm run start:dev

# Linux/Mac
DB_PASSWORD=root npm run start:dev
```

---

## ✅ **ÉTAPE 5 : Vérifications**

### 5.1 URLs importantes

- **API principale** : `http://localhost:3000`
- **Documentation Swagger** : `http://localhost:3000/api/docs`
- **Health check** : `http://localhost:3000/health`

### 5.2 Tests de fonctionnement

1. ✅ L'application démarre sans erreur
2. ✅ Swagger est accessible sur `/api/docs`
3. ✅ CORS fonctionne avec le frontend
4. ✅ L'authentification fonctionne
5. ✅ La création d'étudiants fonctionne
6. ✅ La création de personnel fonctionne
7. ✅ La création de classes fonctionne

### 5.3 Test rapide avec curl

```bash
# Test de l'API principale
curl http://localhost:3000

# Test de Swagger
curl http://localhost:3000/api/docs
```

---

## 🔄 **Corrections récentes appliquées**

### 📅 **Mise à jour : Corrections des APIs publiques et des relations**

### 📅 **Mise à jour : APIs Events et Financières rendues publiques**

#### **1. APIs Events rendues publiques**

**Problème :** Les endpoints `events` nécessitaient une authentification.

**Solution :** Ajout du décorateur `@Public()` à tous les endpoints :

```typescript
// Dans src/modules/event/event.controller.ts
import { Public } from '../../common/decorators/public.decorator';

@Post()
@Public()
@ApiOperation({ summary: 'Créer un nouvel événement' })
// ... tous les autres endpoints
```

**Endpoints Events maintenant publics :**

- ✅ `POST /events` - Créer un événement
- ✅ `GET /events` - Récupérer tous les événements
- ✅ `GET /events/class/:classId` - Événements d'une classe
- ✅ `GET /events/date-range` - Événements dans une plage de dates
- ✅ `GET /events/type/:eventType` - Événements par type
- ✅ `GET /events/calendar/:year/:month` - Événements pour calendrier mensuel
- ✅ `GET /events/upcoming` - Événements à venir
- ✅ `GET /events/:id` - Événement par ID
- ✅ `PATCH /events/:id` - Mettre à jour un événement
- ✅ `DELETE /events/:id` - Supprimer un événement

#### **2. APIs Financières rendues publiques**

**Problème :** Toutes les APIs financières nécessitaient une authentification, compliquant le développement frontend.

**Solution :** Ajout du décorateur `@Public()` à tous les contrôleurs financiers :

**Contrôleurs modifiés :**

- ✅ `PaymentController` - Tous les endpoints
- ✅ `InvoiceController` - Tous les endpoints
- ✅ `FeeTypeController` - Tous les endpoints
- ✅ `StudentFeeController` - Tous les endpoints
- ✅ `DiscountController` - Tous les endpoints
- ✅ `RefundController` - Tous les endpoints
- ✅ `InvoiceItemController` - Tous les endpoints

**APIs Financières maintenant publiques :**

- **Fee-Type** : 6 endpoints (CRUD + récurrents)
- **Student-Fee** : 10 endpoints (CRUD + paiements + résumés)
- **Payment** : 8 endpoints (CRUD + résumés + filtres)
- **Invoice** : 8 endpoints (CRUD + génération numéro)
- **Invoice-Item** : 6 endpoints (CRUD + filtres)
- **Discount** : 6 endpoints (CRUD + filtres)
- **Refund** : 8 endpoints (CRUD + résumés + filtres)

**Total : 52 endpoints financiers publics !**

### 📅 **Mise à jour : Corrections des APIs School-Year et Timetable**

#### **1. Correction du School-Year Service**

**Problème :** Erreur `Empty criteria(s) are not allowed for the update method` lors de la création/mise à jour d'années scolaires.

**Solution :** Remplacer les appels `update({}, { isActive: false })` par une logique de recherche puis mise à jour individuelle :

```typescript
// AVANT (incorrect)
await this.schoolYearRepository.update({}, { isActive: false });

// APRÈS (correct)
const activeSchoolYears = await this.schoolYearRepository.find({
  where: { isActive: true },
});

if (activeSchoolYears.length > 0) {
  await Promise.all(
    activeSchoolYears.map((schoolYear) =>
      this.schoolYearRepository.update(schoolYear.id, { isActive: false }),
    ),
  );
}
```

**Méthodes corrigées :**

- `createSchoolYear()` - Chargement des relations `terms` après sauvegarde
- `updateSchoolYear()` - Filtrage des années actives
- `setActiveSchoolYear()` - Mise à jour individuelle des années

#### **2. Correction du Teaching-Assignment Service**

**Problème :** Validation trop stricte empêchant la planification future des affectations.

**Solution :** Supprimer la validation `startDate <= CURRENT_DATE` pour permettre la planification :

```typescript
// Validation supprimée (permet la planification future)
// if (startDate > new Date()) {
//   throw new BadRequestException('La date de début ne peut pas être dans le futur');
// }

// Garder seulement la validation endDate >= startDate
if (createTeachingAssignmentDto.endDate) {
  const startDate = new Date(createTeachingAssignmentDto.startDate);
  const endDate = new Date(createTeachingAssignmentDto.endDate);

  if (endDate < startDate) {
    throw new BadRequestException(
      'La date de fin doit être postérieure ou égale à la date de début',
    );
  }
}
```

#### **3. APIs rendues publiques**

**Endpoints maintenant publics (avec `@Public()`)** :

- ✅ **School-Year** : Tous les endpoints
- ✅ **Timetable** : Tous les endpoints

#### **4. Correction de la structure de la table Timetables**

**Problème :** `EntityMetadataNotFoundError` et `QueryFailedError` - La structure de la table `timetables` ne correspondait pas à l'entité `Timetable`.

**Solution :** Création et exécution d'une migration pour restructurer la table :

**Migration créée :** `1759317409850-UpdateTimetableStructure.ts`

**Changements appliqués :**

- ❌ Suppression des colonnes : `class_id`, `teacher_id`, `subject_id`
- ✅ Ajout de la colonne : `teaching_assignment_id`
- ✅ Création des index et contraintes de clé étrangère
- ✅ Liaison avec la table `teaching_assignments`

**Commande d'exécution :**

```bash
npm run migration:run
```

**Note :** Si la migration ne s'exécute pas (erreur "No migrations are pending"), supprimer manuellement l'entrée de la table `migrations` puis relancer.

#### **5. Ajout des entités manquantes dans la configuration**

**Problème :** `EntityMetadataNotFoundError: No metadata for "Timetable" was found`

**Solution :** Ajouter les entités manquantes dans `src/config/database.config.ts` :

```typescript
entities: [
  // ... entités existantes
  Timetable,        // ✅ Ajouté
  Event,           // ✅ Ajouté
  EventParticipant, // ✅ Ajouté
  Teacher,
  TeachingAssignment,
  Term,
  User,
],
```

### 📅 **Mise à jour : Corrections des APIs publiques et des relations**

#### **1. Correction du décorateur @Public() dans JwtAuthGuard**

**Problème :** Le guard JWT ne reconnaissait pas le décorateur `@Public()` car l'import était incorrect.

**Solution :** Corriger l'import dans `src/modules/auth/guards/jwt-auth.guard.ts` :

```typescript
// AVANT (incorrect)
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// APRÈS (correct)
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator';
```

#### **2. Création de l'API Student-Class**

**Problème :** L'API `student-class` n'existait pas (pas de contrôleur ni de module).

**Solution :** Créer les fichiers manquants :

- ✅ `src/modules/student-class/student-class.controller.ts`
- ✅ `src/modules/student-class/student-class.module.ts`
- ✅ Import dans `src/app.module.ts`

**Endpoints créés :**

- `POST /student-classes` - Créer une inscription étudiant-classe
- `GET /student-classes` - Récupérer toutes les inscriptions
- `GET /student-classes/student/:studentId` - Classes d'un étudiant
- `GET /student-classes/class/:classId` - Étudiants d'une classe
- `GET /student-classes/:id` - Inscription par ID
- `PATCH /student-classes/:id` - Mettre à jour une inscription
- `DELETE /student-classes/:id` - Supprimer une inscription

#### **3. Correction du chargement des relations**

**Problème :** Erreur `Cannot read properties of undefined (reading 'id')` dans les services.

**Solution :** Charger les relations après la sauvegarde dans :

**StudentClassService :**

```typescript
// Récupérer l'inscription avec les relations chargées
const studentClassWithRelations = await this.studentClassRepository.findOne({
  where: { id: savedStudentClass.id },
  relations: ['student', 'student.user', 'class'],
});
```

**ClassSubjectService :**

```typescript
// Récupérer l'association avec les relations chargées
const classSubjectWithRelations = await this.classSubjectRepository.findOne({
  where: { id: savedClassSubject.id },
  relations: ['class', 'subject'],
});
```

**TeachingAssignmentService :**

```typescript
// Récupérer l'affectation avec les relations chargées
const assignmentWithRelations = await this.teachingAssignmentRepository.findOne(
  {
    where: { id: savedAssignment.id },
    relations: [
      'teacher',
      'teacher.user',
      'classSubject',
      'classSubject.class',
      'classSubject.subject',
    ],
  },
);
```

#### **4. Génération automatique de l'année scolaire**

**Problème :** Erreur `NOT NULL` sur la colonne `year` dans `student_classes`.

**Solution :** Générer automatiquement l'année scolaire à partir de la `startDate` :

```typescript
// Générer l'année scolaire à partir de la date de début
const startDate = new Date(createStudentClassDto.startDate);
const year = startDate.getFullYear();
const nextYear = year + 1;
const schoolYear = `${year}-${nextYear}`; // ex: "2025-2026"
```

#### **5. Validation des dates dans StudentClass**

**Problème :** Contrainte `chk_end_date_after_start` violée.

**Solution :** Ajouter une validation côté service :

```typescript
// Valider que endDate est postérieure à startDate si elle est fournie
if (createStudentClassDto.endDate) {
  const startDate = new Date(createStudentClassDto.startDate);
  const endDate = new Date(createStudentClassDto.endDate);

  if (endDate < startDate) {
    throw new ConflictException(
      'La date de fin doit être postérieure ou égale à la date de début',
    );
  }
}
```

#### **6. APIs rendues publiques**

**Endpoints maintenant publics (avec `@Public()`)** :

- ✅ **Class-Subject** : Tous les endpoints
- ✅ **Student-Class** : Tous les endpoints
- ✅ **Teaching-Assignment** : Tous les endpoints
- ✅ **School-Year** : Tous les endpoints
- ✅ **Timetable** : Tous les endpoints
- ✅ **Events** : Tous les endpoints
- ✅ **APIs Financières** : Toutes les APIs financières

**Utilisation :** Ces endpoints sont maintenant accessibles sans authentification pour faciliter le développement frontend.

---

## 🚨 **Problèmes courants et solutions**

### Erreur : "Cannot read properties of undefined (reading 'id')"

- **Cause** : Relations non chargées dans les services
- **Solution** : Appliquer les corrections des services (étapes 3.4, 3.5)

### Erreur : "une valeur NULL viole la contrainte NOT NULL de la colonne « category_id »"

- **Cause** : Mapping incorrect entre DTO et entité
- **Solution** : Appliquer la correction du ClassService (étape 3.6)

### Erreur : "la valeur d'une clé dupliquée rompt la contrainte unique"

- **Cause** : Tentative de création d'un utilisateur avec un email existant
- **Solution** : Vérifier que l'email n'existe pas déjà ou utiliser un email différent

### Erreur : "Empty criteria(s) are not allowed for the update method"

- **Cause** : Utilisation de `update({}, { isActive: false })` avec des critères vides
- **Solution** : Utiliser `find()` puis `update()` individuellement sur chaque entité

### Erreur : "EntityMetadataNotFoundError: No metadata for 'Timetable' was found"

- **Cause** : Entités manquantes dans la configuration TypeORM
- **Solution** : Ajouter `Timetable`, `Event`, `EventParticipant` dans `database.config.ts`

### Erreur : "la colonne timetable.teaching_assignment_id n'existe pas, petite incoherence j'ai du lancer une new migration"

- **Cause** : Structure de table obsolète ne correspondant pas à l'entité
- **Solution** : Exécuter la migration `UpdateTimetableStructure` avec `npm run migration:run`

### Erreur : "Token invalide" malgré un token valide

- **Cause** : Bug dans la stratégie JWT utilisant `getUserByEmail()` au lieu de `getUserByEmailWithPassword()`
- **Solution** : Corriger l'import et utiliser la bonne méthode dans `jwt.strategy.ts`

---

## 🎯 **Résultat attendu**

Après avoir suivi toutes ces étapes, vous devriez avoir :

- ✅ Une API fonctionnelle sur `http://localhost:3000`
- ✅ Une documentation Swagger accessible sur `http://localhost:3000/api/docs`
- ✅ Tous les endpoints fonctionnels (auth, users, students, staff, classes, etc.)
- ✅ **Nouvelles APIs publiques** :
  - `class-subjects` - Gestion des associations classe-matière
  - `student-classes` - Gestion des inscriptions étudiant-classe
  - `teaching-assignments` - Gestion des affectations d'enseignement
  - `school-years` - Gestion des années scolaires
  - `timetables` - Gestion des emplois du temps
  - `events` - Gestion des événements
  - **APIs Financières complètes** - 52 endpoints financiers publics
- ✅ CORS configuré pour le frontend
- ✅ Base de données avec toutes les tables créées
- ✅ Relations correctement chargées dans tous les services
- ✅ Validation des données côté service
- ✅ Structure de base de données mise à jour (migration Timetables)
- ✅ Planification future des affectations d'enseignement autorisée
- ✅ **APIs Financières complètes** : Toutes les APIs financières publiques
- ✅ **Système de facturation** : Gestion complète des factures, paiements, réductions

---

## 💰 **APIs Financières Disponibles**

### **📊 Architecture Financière :**

Le système financier ITAK Manager gère :

1. **FeeType** - Types de frais (scolarité, cantine, transport, etc.)
2. **StudentFee** - Frais assignés individuellement aux étudiants
3. **Payment** - Historique des paiements effectués
4. **Invoice** - Documents de facturation
5. **InvoiceItem** - Détails des éléments de facture
6. **Discount** - Réductions appliquées (bourses, exemptions)
7. **Refund** - Remboursements

### **🔄 Flux Financier :**

```
FeeType → StudentFee → Invoice → Payment
    ↓         ↓         ↓
Discount → InvoiceItem → Refund
```

### **📋 APIs Financières Publiques :**

#### **1. Fee-Type (Types de Frais)**

- `POST /fee-types` - Créer un type de frais
- `GET /fee-types` - Récupérer tous les types
- `GET /fee-types/recurring` - Types récurrents
- `GET /fee-types/:id` - Type par ID
- `PATCH /fee-types/:id` - Mettre à jour
- `DELETE /fee-types/:id` - Supprimer

#### **2. Student-Fee (Frais Étudiant)**

- `POST /student-fees` - Assigner des frais
- `GET /student-fees` - Tous les frais
- `GET /student-fees/overdue` - Frais en retard
- `POST /student-fees/mark-overdue` - Marquer en retard
- `GET /student-fees/student/:studentId` - Frais d'un étudiant
- `GET /student-fees/student/:studentId/summary` - Résumé
- `GET /student-fees/:id` - Frais par ID
- `PATCH /student-fees/:id` - Mettre à jour
- `POST /student-fees/:id/pay` - Effectuer un paiement
- `DELETE /student-fees/:id` - Supprimer

#### **3. Payment (Paiements)**

- `POST /payments` - Enregistrer un paiement
- `GET /payments` - Tous les paiements
- `GET /payments/summary` - Résumé des paiements
- `GET /payments/student-fee/:studentFeeId` - Paiements par frais
- `GET /payments/user/:userId` - Paiements par utilisateur
- `GET /payments/:id` - Paiement par ID
- `PATCH /payments/:id` - Mettre à jour
- `DELETE /payments/:id` - Supprimer

#### **4. Invoice (Factures)**

- `POST /invoices` - Créer une facture
- `GET /invoices` - Toutes les factures
- `GET /invoices/generate-number` - Générer numéro
- `GET /invoices/student/:studentId` - Factures d'un étudiant
- `GET /invoices/number/:invoiceNumber` - Facture par numéro
- `GET /invoices/:id` - Facture par ID
- `PATCH /invoices/:id` - Mettre à jour
- `DELETE /invoices/:id` - Supprimer

#### **5. Invoice-Item (Éléments de Facture)**

- `POST /invoice-items` - Créer une ligne
- `GET /invoice-items` - Toutes les lignes
- `GET /invoice-items/invoice/:invoiceId` - Lignes d'une facture
- `GET /invoice-items/:id` - Ligne par ID
- `PATCH /invoice-items/:id` - Mettre à jour
- `DELETE /invoice-items/:id` - Supprimer

#### **6. Discount (Réductions)**

- `POST /discounts` - Créer une réduction
- `GET /discounts` - Toutes les réductions
- `GET /discounts/student-fee/:studentFeeId` - Réductions par frais
- `GET /discounts/:id` - Réduction par ID
- `PATCH /discounts/:id` - Mettre à jour
- `DELETE /discounts/:id` - Supprimer

#### **7. Refund (Remboursements)**

- `POST /refunds` - Créer un remboursement
- `GET /refunds` - Tous les remboursements
- `GET /refunds/summary` - Résumé des remboursements
- `GET /refunds/payment/:paymentId` - Remboursements par paiement
- `GET /refunds/user/:userId` - Remboursements par utilisateur
- `GET /refunds/:id` - Remboursement par ID
- `PATCH /refunds/:id` - Mettre à jour
- `DELETE /refunds/:id` - Supprimer

### **💡 Fonctionnalités Clés :**

- ✅ **Calculs automatiques** : Montant payé calculé dynamiquement
- ✅ **Statuts automatiques** : Mise à jour automatique des statuts
- ✅ **Validation des montants** : Vérification avant paiement
- ✅ **Traçabilité complète** : Qui a reçu, approuvé, traité
- ✅ **Gestion des réductions** : Bourses, exemptions, réductions fratrie
- ✅ **Remboursements** : Gestion complète des remboursements

### **⚠️ Note sur la Facturation :**

**État actuel :** Le système de facturation est **manuel** - le frontend doit fournir toutes les données (montant, numéro, dates).

**Recommandation :** Améliorer le backend pour une **génération automatique** des factures à partir des `StudentFee`.
