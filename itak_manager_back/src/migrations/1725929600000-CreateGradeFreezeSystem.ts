import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGradeFreezeSystem1725929600000
  implements MigrationInterface
{
  name = 'CreateGradeFreezeSystem1725929600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create freeze_scope enum
    await queryRunner.query(`
      CREATE TYPE "freeze_scope_enum" AS ENUM('school_wide', 'term_specific', 'class_specific')
    `);

    // Create freeze_status enum
    await queryRunner.query(`
      CREATE TYPE "freeze_status_enum" AS ENUM('scheduled', 'active', 'completed', 'cancelled')
    `);

    // Create grade_freeze_periods table
    await queryRunner.query(`
      CREATE TABLE "grade_freeze_periods" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "school_year_id" uuid NOT NULL,
        "term_id" uuid,
        "class_id" uuid,
        "title" character varying(200) NOT NULL,
        "description" text,
        "scope" "freeze_scope_enum" NOT NULL DEFAULT 'school_wide',
        "status" "freeze_status_enum" NOT NULL DEFAULT 'scheduled',
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "created_by" uuid NOT NULL,
        "approved_by" uuid,
        "approved_at" TIMESTAMP,
        "cancelled_by" uuid,
        "cancelled_at" TIMESTAMP,
        "cancellation_reason" text,
        "allow_emergency_override" boolean NOT NULL DEFAULT false,
        "override_password" character varying(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_grade_freeze_periods" PRIMARY KEY ("id"),
        CONSTRAINT "chk_end_date_after_start" CHECK ("end_date" > "start_date")
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_school_year" 
      ON "grade_freeze_periods" ("school_year_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_term" 
      ON "grade_freeze_periods" ("term_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_class" 
      ON "grade_freeze_periods" ("class_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_dates" 
      ON "grade_freeze_periods" ("school_year_id", "start_date", "end_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_status_scope" 
      ON "grade_freeze_periods" ("status", "scope")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_start_date" 
      ON "grade_freeze_periods" ("start_date")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_grade_freeze_periods_end_date" 
      ON "grade_freeze_periods" ("end_date")
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_school_year" 
      FOREIGN KEY ("school_year_id") REFERENCES "school_years"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_term" 
      FOREIGN KEY ("term_id") REFERENCES "terms"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_class" 
      FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_created_by" 
      FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_approved_by" 
      FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" 
      ADD CONSTRAINT "FK_grade_freeze_periods_cancelled_by" 
      FOREIGN KEY ("cancelled_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_cancelled_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_approved_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_created_by"
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_class"
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_term"
    `);

    await queryRunner.query(`
      ALTER TABLE "grade_freeze_periods" DROP CONSTRAINT "FK_grade_freeze_periods_school_year"
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_grade_freeze_periods_end_date"`);
    await queryRunner.query(`DROP INDEX "IDX_grade_freeze_periods_start_date"`);
    await queryRunner.query(
      `DROP INDEX "IDX_grade_freeze_periods_status_scope"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_grade_freeze_periods_dates"`);
    await queryRunner.query(`DROP INDEX "IDX_grade_freeze_periods_class"`);
    await queryRunner.query(`DROP INDEX "IDX_grade_freeze_periods_term"`);
    await queryRunner.query(
      `DROP INDEX "IDX_grade_freeze_periods_school_year"`,
    );

    // Drop table
    await queryRunner.query(`DROP TABLE "grade_freeze_periods"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "freeze_status_enum"`);
    await queryRunner.query(`DROP TYPE "freeze_scope_enum"`);
  }
}
