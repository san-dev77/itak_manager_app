import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeSchoolYearDatesNullable1761000000000
  implements MigrationInterface
{
  name = 'MakeSchoolYearDatesNullable1761000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la table existe
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'school_years'
      )
    `);

    if (tableExists[0].exists) {
      // Rendre les colonnes nullable
      await queryRunner.query(`
        ALTER TABLE "school_years" 
        ALTER COLUMN "start_date" DROP NOT NULL
      `);

      await queryRunner.query(`
        ALTER TABLE "school_years" 
        ALTER COLUMN "end_date" DROP NOT NULL
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Vérifier si la table existe
    const tableExists = await queryRunner.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'school_years'
      )
    `);

    if (tableExists[0].exists) {
      // Remettre les colonnes NOT NULL (attention: cela peut échouer si des valeurs NULL existent)
      await queryRunner.query(`
        ALTER TABLE "school_years" 
        ALTER COLUMN "start_date" SET NOT NULL
      `);

      await queryRunner.query(`
        ALTER TABLE "school_years" 
        ALTER COLUMN "end_date" SET NOT NULL
      `);
    }
  }
}

