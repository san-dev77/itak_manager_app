import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentVersioning1725928800000
  implements MigrationInterface
{
  name = 'CreateAssessmentVersioning1725928800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create version_action enum
    await queryRunner.query(`
      CREATE TYPE "version_action_enum" AS ENUM('created', 'updated', 'deleted', 'restored')
    `);

    // Create assessment_type enum if it doesn't exist
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "assessment_type_enum" AS ENUM('exam', 'homework', 'supervised_homework', 'test', 'quiz', 'monthly_composition', 'continuous_assessment');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create assessment_versions table
    await queryRunner.query(`
      CREATE TABLE "assessment_versions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "assessment_id" uuid NOT NULL,
        "version_number" integer NOT NULL,
        "version_action" "version_action_enum" NOT NULL,
        "term_id" uuid NOT NULL,
        "class_subject_id" uuid NOT NULL,
        "school_year_id" uuid NOT NULL,
        "type" "assessment_type_enum" NOT NULL,
        "title" character varying(100) NOT NULL,
        "description" text,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "max_score" numeric(5,2) NOT NULL,
        "weight" numeric(5,2) NOT NULL,
        "changed_by" uuid NOT NULL,
        "change_reason" text,
        "changed_fields" json,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assessment_versions" PRIMARY KEY ("id")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_versions_assessment_id" ON "assessment_versions" ("assessment_id")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_assessment_versions_assessment_version" 
      ON "assessment_versions" ("assessment_id", "version_number")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_versions_assessment_created" 
      ON "assessment_versions" ("assessment_id", "created_at")
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "assessment_versions" 
      ADD CONSTRAINT "FK_assessment_versions_assessment" 
      FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_versions" 
      ADD CONSTRAINT "FK_assessment_versions_user" 
      FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "assessment_versions" DROP CONSTRAINT "FK_assessment_versions_user"
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_versions" DROP CONSTRAINT "FK_assessment_versions_assessment"
    `);

    // Drop indexes
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_versions_assessment_created"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_versions_assessment_version"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_versions_assessment_id"`,
    );

    // Drop table
    await queryRunner.query(`DROP TABLE "assessment_versions"`);

    // Drop enum
    await queryRunner.query(`DROP TYPE "version_action_enum"`);
  }
}
