import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInstitutionEntity1738000000000 implements MigrationInterface {
  name = 'AddInstitutionEntity1738000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la table institutions existe déjà
    const institutionsTable = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'institutions'
      )
    `);

    // Créer la table institutions si elle n'existe pas
    if (!institutionsTable[0].exists) {
      await queryRunner.query(`
        CREATE TABLE "institutions" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "name" character varying(50) NOT NULL,
          "code" character varying(10) NOT NULL,
          "description" text,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_institutions_name" UNIQUE ("name"),
          CONSTRAINT "UQ_institutions_code" UNIQUE ("code"),
          CONSTRAINT "PK_institutions" PRIMARY KEY ("id")
        )
      `);

      await queryRunner.query(
        `CREATE INDEX "IDX_institutions_name" ON "institutions" ("name")`,
      );
      await queryRunner.query(
        `CREATE INDEX "IDX_institutions_code" ON "institutions" ("code")`,
      );
    }

    // Vérifier si la table students existe avant d'ajouter institution_id
    const studentsTable = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'students'
      )
    `);

    if (studentsTable[0].exists) {
      // Vérifier si la colonne institution_id existe déjà
      const institutionIdColumn = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'students' 
          AND column_name = 'institution_id'
        )
      `);

      if (!institutionIdColumn[0].exists) {
        // Ajouter institution_id à students
        await queryRunner.query(`
          ALTER TABLE "students"
          ADD COLUMN "institution_id" uuid
        `);

        await queryRunner.query(
          `CREATE INDEX "IDX_students_institution_id" ON "students" ("institution_id")`,
        );

        await queryRunner.query(`
          ALTER TABLE "students"
          ADD CONSTRAINT "FK_students_institution"
          FOREIGN KEY ("institution_id")
          REFERENCES "institutions"("id")
          ON DELETE SET NULL
        `);
      }
    }

    // Vérifier si la table teachers existe avant d'ajouter institution_id
    const teachersTable = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'teachers'
      )
    `);

    if (teachersTable[0].exists) {
      // Vérifier si la colonne institution_id existe déjà
      const institutionIdColumn = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'teachers' 
          AND column_name = 'institution_id'
        )
      `);

      if (!institutionIdColumn[0].exists) {
        // Ajouter institution_id à teachers
        await queryRunner.query(`
          ALTER TABLE "teachers"
          ADD COLUMN "institution_id" uuid
        `);

        await queryRunner.query(
          `CREATE INDEX "IDX_teachers_institution_id" ON "teachers" ("institution_id")`,
        );

        await queryRunner.query(`
          ALTER TABLE "teachers"
          ADD CONSTRAINT "FK_teachers_institution"
          FOREIGN KEY ("institution_id")
          REFERENCES "institutions"("id")
          ON DELETE SET NULL
        `);
      }
    }

    // Vérifier si la table class_category existe avant d'ajouter institution_id
    const classCategoryTable = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'class_category'
      )
    `);

    if (classCategoryTable[0].exists) {
      // Vérifier si la colonne institution_id existe déjà
      const institutionIdColumn = await queryRunner.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'class_category' 
          AND column_name = 'institution_id'
        )
      `);

      if (!institutionIdColumn[0].exists) {
        // Ajouter institution_id à class_category
        await queryRunner.query(`
          ALTER TABLE "class_category"
          ADD COLUMN "institution_id" uuid
        `);

        await queryRunner.query(
          `CREATE INDEX "IDX_class_category_institution_id" ON "class_category" ("institution_id")`,
        );

        await queryRunner.query(`
          ALTER TABLE "class_category"
          ADD CONSTRAINT "FK_class_category_institution"
          FOREIGN KEY ("institution_id")
          REFERENCES "institutions"("id")
          ON DELETE SET NULL
        `);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer les contraintes et colonnes
    await queryRunner.query(`
      ALTER TABLE "class_category"
      DROP CONSTRAINT IF EXISTS "FK_class_category_institution"
    `);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_class_category_institution_id"`,
    );
    await queryRunner.query(`
      ALTER TABLE "class_category"
      DROP COLUMN IF EXISTS "institution_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "teachers"
      DROP CONSTRAINT IF EXISTS "FK_teachers_institution"
    `);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_teachers_institution_id"`,
    );
    await queryRunner.query(`
      ALTER TABLE "teachers"
      DROP COLUMN IF EXISTS "institution_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "students"
      DROP CONSTRAINT IF EXISTS "FK_students_institution"
    `);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_students_institution_id"`,
    );
    await queryRunner.query(`
      ALTER TABLE "students"
      DROP COLUMN IF EXISTS "institution_id"
    `);

    // Supprimer la table institutions
    await queryRunner.query(`DROP TABLE IF EXISTS "institutions"`);
  }
}
