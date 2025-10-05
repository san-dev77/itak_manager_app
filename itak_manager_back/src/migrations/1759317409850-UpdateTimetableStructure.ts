import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimetableStructure1759317409850
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    //ici on supprime les anciennes contraintes de clé étrangère
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_54d3ddcc757a7639a1ca4ea159c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_82b11ba087125514207fa541c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_6f592a24e991c80fabe3f3b8447"`,
    );

    //ici on supprime les anciens index
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_54d3ddcc757a7639a1ca4ea159"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_82b11ba087125514207fa541c3"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_6f592a24e991c80fabe3f3b844"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_d9b15cab5293a8ef52771c3a40"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_9dacd47ded63b88095e262feec"`,
    );

    //ici on ajoute la nouvelle colonne teaching_assignment_id
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD "teaching_assignment_id" uuid NOT NULL`,
    );

    //ici on crée un index sur teaching_assignment_id
    await queryRunner.query(
      `CREATE INDEX "IDX_timetable_teaching_assignment" ON "timetables" ("teaching_assignment_id")`,
    );

    //ici on crée un index composite
    await queryRunner.query(
      `CREATE INDEX "IDX_timetable_composite" ON "timetables" ("teaching_assignment_id", "academic_year_id", "day_of_week", "start_time")`,
    );

    //ici on ajoute la contrainte de clé étrangère pour teaching_assignment_id
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD CONSTRAINT "FK_timetable_teaching_assignment" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // Supprimer les anciennes colonnes
    await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "class_id"`);
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP COLUMN "teacher_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP COLUMN "subject_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Rétablir les anciennes colonnes
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD "class_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD "teacher_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD "subject_id" uuid NOT NULL`,
    );

    // Supprimer la nouvelle contrainte
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP CONSTRAINT "FK_timetable_teaching_assignment"`,
    );

    // Supprimer les nouveaux index
    await queryRunner.query(`DROP INDEX "IDX_timetable_composite"`);
    await queryRunner.query(`DROP INDEX "IDX_timetable_teaching_assignment"`);

    // Supprimer la nouvelle colonne
    await queryRunner.query(
      `ALTER TABLE "timetables" DROP COLUMN "teaching_assignment_id"`,
    );

    // Recréer les anciens index
    await queryRunner.query(
      `CREATE INDEX "IDX_54d3ddcc757a7639a1ca4ea159" ON "timetables" ("class_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_82b11ba087125514207fa541c3" ON "timetables" ("teacher_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f592a24e991c80fabe3f3b844" ON "timetables" ("subject_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d9b15cab5293a8ef52771c3a40" ON "timetables" ("teacher_id", "academic_year_id", "day_of_week", "start_time")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9dacd47ded63b88095e262feec" ON "timetables" ("class_id", "teacher_id", "academic_year_id", "day_of_week", "start_time")`,
    );

    // Recréer les anciennes contraintes
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD CONSTRAINT "FK_54d3ddcc757a7639a1ca4ea159c" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD CONSTRAINT "FK_82b11ba087125514207fa541c3c" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "timetables" ADD CONSTRAINT "FK_6f592a24e991c80fabe3f3b8447" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
