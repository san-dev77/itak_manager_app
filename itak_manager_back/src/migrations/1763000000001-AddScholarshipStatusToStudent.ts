import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddScholarshipStatusToStudent1763000000001
  implements MigrationInterface
{
  name = 'AddScholarshipStatusToStudent1763000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" ADD "scholarship_status" character varying(20) NOT NULL DEFAULT 'non_boursier'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "students" DROP COLUMN "scholarship_status"`,
    );
  }
}
