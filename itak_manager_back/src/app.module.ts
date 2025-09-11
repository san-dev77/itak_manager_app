import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { StaffModule } from './modules/staff/staff.module';
import { ClassModule } from './modules/class/class.module';
import { ClassCategoryModule } from './modules/class-category/class-category.module';
import { SubjectModule } from './modules/subject/subject.module';
import { ParentModule } from './modules/parent/parent.module';
import { PromotionModule } from './modules/promotion/promotion.module';
import { SchoolYearModule } from './modules/school-year/school-year.module';
import { TermModule } from './modules/term/term.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { AssessmentResultModule } from './modules/assessment-result/assessment-result.module';
import { GradeComplaintModule } from './modules/grade-complaint/grade-complaint.module';
import { AssessmentSubjectModule } from './modules/assessment-subject/assessment-subject.module';
import { StudentTransferModule } from './modules/student-transfer/student-transfer.module';
import { AssessmentAttendanceModule } from './modules/assessment-attendance/assessment-attendance.module';
import { GradeCalculationModule } from './modules/grade-calculation/grade-calculation.module';
import { AssessmentVersionModule } from './modules/assessment-version/assessment-version.module';
import { GradeFreezeModule } from './modules/grade-freeze/grade-freeze.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    AuthModule,
    UserModule,
    StudentModule,
    TeacherModule,
    StaffModule,
    ClassModule,
    ClassCategoryModule,
    SubjectModule,
    ParentModule,
    PromotionModule,
    SchoolYearModule,
    TermModule,
    AssessmentModule,
    AssessmentResultModule,
    GradeComplaintModule,
    AssessmentSubjectModule,
    StudentTransferModule,
    AssessmentAttendanceModule,
    GradeCalculationModule,
    AssessmentVersionModule,
    GradeFreezeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
