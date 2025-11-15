"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTimetableStructure1759317409850 = void 0;
class UpdateTimetableStructure1759317409850 {
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_54d3ddcc757a7639a1ca4ea159c"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_82b11ba087125514207fa541c3c"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP CONSTRAINT IF EXISTS "FK_6f592a24e991c80fabe3f3b8447"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_54d3ddcc757a7639a1ca4ea159"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_82b11ba087125514207fa541c3"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_6f592a24e991c80fabe3f3b844"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_d9b15cab5293a8ef52771c3a40"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_9dacd47ded63b88095e262feec"`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD "teaching_assignment_id" uuid NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_timetable_teaching_assignment" ON "timetables" ("teaching_assignment_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_timetable_composite" ON "timetables" ("teaching_assignment_id", "academic_year_id", "day_of_week", "start_time")`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD CONSTRAINT "FK_timetable_teaching_assignment" FOREIGN KEY ("teaching_assignment_id") REFERENCES "teaching_assignments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "class_id"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "teacher_id"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "subject_id"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "timetables" ADD "class_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD "teacher_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD "subject_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP CONSTRAINT "FK_timetable_teaching_assignment"`);
        await queryRunner.query(`DROP INDEX "IDX_timetable_composite"`);
        await queryRunner.query(`DROP INDEX "IDX_timetable_teaching_assignment"`);
        await queryRunner.query(`ALTER TABLE "timetables" DROP COLUMN "teaching_assignment_id"`);
        await queryRunner.query(`CREATE INDEX "IDX_54d3ddcc757a7639a1ca4ea159" ON "timetables" ("class_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_82b11ba087125514207fa541c3" ON "timetables" ("teacher_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_6f592a24e991c80fabe3f3b844" ON "timetables" ("subject_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_d9b15cab5293a8ef52771c3a40" ON "timetables" ("teacher_id", "academic_year_id", "day_of_week", "start_time")`);
        await queryRunner.query(`CREATE INDEX "IDX_9dacd47ded63b88095e262feec" ON "timetables" ("class_id", "teacher_id", "academic_year_id", "day_of_week", "start_time")`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD CONSTRAINT "FK_54d3ddcc757a7639a1ca4ea159c" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD CONSTRAINT "FK_82b11ba087125514207fa541c3c" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "timetables" ADD CONSTRAINT "FK_6f592a24e991c80fabe3f3b8447" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
exports.UpdateTimetableStructure1759317409850 = UpdateTimetableStructure1759317409850;
//# sourceMappingURL=1759317409850-UpdateTimetableStructure.js.map