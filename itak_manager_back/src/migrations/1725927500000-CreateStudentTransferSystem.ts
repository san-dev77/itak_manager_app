import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStudentTransferSystem1725927500000
  implements MigrationInterface
{
  name = 'CreateStudentTransferSystem1725927500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create transfer reason enum type
    await queryRunner.query(`
      CREATE TYPE "transfer_reason_enum" AS ENUM(
        'disciplinary', 
        'academic', 
        'medical', 
        'family_request', 
        'administrative', 
        'capacity_adjustment'
      )
    `);

    // Create student class status enum type
    await queryRunner.query(`
      CREATE TYPE "student_class_status_enum" AS ENUM(
        'active', 
        'transferred', 
        'repeating', 
        'graduated', 
        'dropped'
      )
    `);

    // Add status and year columns to student_classes table
    await queryRunner.query(`
      ALTER TABLE "student_classes" 
      ADD COLUMN "status" "student_class_status_enum" NOT NULL DEFAULT 'active',
      ADD COLUMN "year" VARCHAR(9) NOT NULL DEFAULT '2025-2026'
    `);

    // Create indexes for new columns
    await queryRunner.query(`
      CREATE INDEX "IDX_student_classes_status" ON "student_classes" ("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_classes_year" ON "student_classes" ("year")
    `);

    // Create student_transfers table
    await queryRunner.query(`
      CREATE TABLE "student_transfers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "student_id" uuid NOT NULL,
        "from_class_id" uuid NOT NULL,
        "to_class_id" uuid NOT NULL,
        "transfer_date" DATE NOT NULL,
        "reason" "transfer_reason_enum" NOT NULL,
        "reason_details" TEXT,
        "year" VARCHAR(9) NOT NULL,
        "approved_by" uuid,
        "approval_date" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_student_transfers" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_different_classes" CHECK ("from_class_id" != "to_class_id"),
        CONSTRAINT "CHK_transfer_date_not_future" CHECK ("transfer_date" <= CURRENT_DATE)
      )
    `);

    // Create indexes for student_transfers
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_student_id" ON "student_transfers" ("student_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_from_class_id" ON "student_transfers" ("from_class_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_to_class_id" ON "student_transfers" ("to_class_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_transfer_date" ON "student_transfers" ("transfer_date")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_reason" ON "student_transfers" ("reason")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_student_transfers_year" ON "student_transfers" ("year")
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "student_transfers" 
      ADD CONSTRAINT "FK_student_transfers_student" 
      FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "student_transfers" 
      ADD CONSTRAINT "FK_student_transfers_from_class" 
      FOREIGN KEY ("from_class_id") REFERENCES "classes"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "student_transfers" 
      ADD CONSTRAINT "FK_student_transfers_to_class" 
      FOREIGN KEY ("to_class_id") REFERENCES "classes"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "student_transfers" 
      ADD CONSTRAINT "FK_student_transfers_approved_by" 
      FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop student_transfers table
    await queryRunner.query(`DROP TABLE "student_transfers"`);

    // Remove columns from student_classes
    await queryRunner.query(`
      ALTER TABLE "student_classes" 
      DROP COLUMN "status",
      DROP COLUMN "year"
    `);

    // Drop enum types
    await queryRunner.query(`DROP TYPE "transfer_reason_enum"`);
    await queryRunner.query(`DROP TYPE "student_class_status_enum"`);
  }
}
