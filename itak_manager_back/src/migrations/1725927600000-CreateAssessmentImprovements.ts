import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAssessmentImprovements1725927600000
  implements MigrationInterface
{
  name = 'CreateAssessmentImprovements1725927600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create attendance status enum
    await queryRunner.query(`
      CREATE TYPE "attendance_status_enum" AS ENUM('present', 'absent', 'excused', 'excluded')
    `);

    // Add school_year_id to assessments table
    await queryRunner.query(`
      ALTER TABLE "assessments" 
      ADD COLUMN "school_year_id" uuid NOT NULL
    `);

    // Add foreign key constraint for school_year_id
    await queryRunner.query(`
      ALTER TABLE "assessments" 
      ADD CONSTRAINT "FK_assessments_school_year" 
      FOREIGN KEY ("school_year_id") REFERENCES "school_years"("id") ON DELETE CASCADE
    `);

    // Add index on school_year_id
    await queryRunner.query(`
      CREATE INDEX "IDX_assessments_school_year_id" ON "assessments" ("school_year_id")
    `);

    // Create assessment_attendance table
    await queryRunner.query(`
      CREATE TABLE "assessment_attendance" (
        "assessment_id" uuid NOT NULL,
        "student_id" uuid NOT NULL,
        "status" "attendance_status_enum" NOT NULL DEFAULT 'present',
        "reason" text,
        "marked_by" uuid,
        "marked_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assessment_attendance" PRIMARY KEY ("assessment_id", "student_id")
      )
    `);

    // Add foreign key constraints for assessment_attendance
    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" 
      ADD CONSTRAINT "FK_assessment_attendance_assessment" 
      FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" 
      ADD CONSTRAINT "FK_assessment_attendance_student" 
      FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" 
      ADD CONSTRAINT "FK_assessment_attendance_marked_by" 
      FOREIGN KEY ("marked_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    // Add indexes for performance
    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_attendance_assessment_id" ON "assessment_attendance" ("assessment_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_attendance_student_id" ON "assessment_attendance" ("student_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_attendance_status" ON "assessment_attendance" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_attendance_marked_by" ON "assessment_attendance" ("marked_by")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_assessment_attendance_created_at" ON "assessment_attendance" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop assessment_attendance table and related indexes
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_attendance_created_at"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_assessment_attendance_marked_by"`);
    await queryRunner.query(`DROP INDEX "IDX_assessment_attendance_status"`);
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_attendance_student_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_assessment_attendance_assessment_id"`,
    );

    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" DROP CONSTRAINT "FK_assessment_attendance_marked_by"
    `);
    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" DROP CONSTRAINT "FK_assessment_attendance_student"
    `);
    await queryRunner.query(`
      ALTER TABLE "assessment_attendance" DROP CONSTRAINT "FK_assessment_attendance_assessment"
    `);

    await queryRunner.query(`DROP TABLE "assessment_attendance"`);

    // Remove school_year_id from assessments
    await queryRunner.query(`DROP INDEX "IDX_assessments_school_year_id"`);
    await queryRunner.query(`
      ALTER TABLE "assessments" DROP CONSTRAINT "FK_assessments_school_year"
    `);
    await queryRunner.query(
      `ALTER TABLE "assessments" DROP COLUMN "school_year_id"`,
    );

    // Drop attendance status enum
    await queryRunner.query(`DROP TYPE "attendance_status_enum"`);
  }
}
