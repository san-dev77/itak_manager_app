import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAssessmentResultStatus1725930000000
  implements MigrationInterface
{
  name = 'UpdateAssessmentResultStatus1725930000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the assessment_result_status enum
    await queryRunner.query(`
      CREATE TYPE "assessment_result_status_enum" AS ENUM('present', 'absent', 'excused', 'excluded')
    `);

    // Add the status column with default value 'present'
    await queryRunner.query(`
      ALTER TABLE "assessment_results" 
      ADD COLUMN "status" "assessment_result_status_enum" NOT NULL DEFAULT 'present'
    `);

    // Update existing records based on is_absent and is_excused values
    // If is_excused is true, set status to 'excused'
    // If is_absent is true and is_excused is false, set status to 'absent'
    // Otherwise, set status to 'present'
    await queryRunner.query(`
      UPDATE "assessment_results" 
      SET "status" = CASE 
        WHEN "is_excused" = true THEN 'excused'::assessment_result_status_enum
        WHEN "is_absent" = true AND "is_excused" = false THEN 'absent'::assessment_result_status_enum
        ELSE 'present'::assessment_result_status_enum
      END
    `);

    // Remove the old boolean columns
    await queryRunner.query(`
      ALTER TABLE "assessment_results" DROP COLUMN "is_absent"
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_results" DROP COLUMN "is_excused"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Add back the boolean columns
    await queryRunner.query(`
      ALTER TABLE "assessment_results" 
      ADD COLUMN "is_absent" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(`
      ALTER TABLE "assessment_results" 
      ADD COLUMN "is_excused" boolean NOT NULL DEFAULT false
    `);

    // Update the boolean columns based on status values
    await queryRunner.query(`
      UPDATE "assessment_results" 
      SET "is_absent" = CASE 
        WHEN "status" IN ('absent', 'excused', 'excluded') THEN true
        ELSE false
      END,
      "is_excused" = CASE 
        WHEN "status" = 'excused' THEN true
        ELSE false
      END
    `);

    // Remove the status column
    await queryRunner.query(`
      ALTER TABLE "assessment_results" DROP COLUMN "status"
    `);

    // Drop the enum type
    await queryRunner.query(`
      DROP TYPE "assessment_result_status_enum"
    `);
  }
}
