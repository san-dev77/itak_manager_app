import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Assessment } from '../entities/assessment.entity';
import { AssessmentResult } from '../entities/assessment-result.entity';
import { StudentPromotion } from '../entities/student-promotion.entity';
import { GradeComplaint } from '../entities/grade-complaint.entity';
import { GradeComplaintHistory } from '../entities/grade-complaint-history.entity';
import { StudentTransfer } from '../entities/student-transfer.entity';
import { AssessmentAttendance } from '../entities/assessment-attendance.entity';
import { SchoolYear } from '../entities/school-year.entity';
import { Term } from '../entities/term.entity';
import { AssessmentSubject } from '../entities/assessment-subject.entity';
import { AssessmentVersion } from '../entities/assessment-version.entity';
import { GradeFreezePeriod } from '../entities/grade-freeze-period.entity';
import { StudentFee } from '../entities/student-fee.entity';
import { FeeType } from '../entities/fee-type.entity';
import { Payment } from '../entities/payment.entity';
import { Refund } from '../entities/refund.entity';
import { Discount } from '../entities/discount.entity';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceItem } from '../entities/invoice-item.entity';
import { ClassCategory } from '../entities/class-category.entity';
import { ClassSubject } from '../entities/class-subject.entity';
import { Parent } from '../entities/parent.entity';
import { Staff } from '../entities/staff.entity';
import { Student } from '../entities/student.entity';
import { StudentClass } from '../entities/student-class.entity';
import { StudentParent } from '../entities/student-parent.entity';
import { Timetable } from '../entities/timetable.entity';
import { Event } from '../entities/event.entity';
import { EventParticipant } from '../entities/event-participant.entity';
import { Teacher } from '../entities/teacher.entity';
import { TeachingAssignment } from '../entities/teaching-assignment.entity';
import { User } from '../entities/user.entity';
import { Subject } from '../entities/subject.entity';
import { Class } from '../entities/class.entity';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DB_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'itak_manager',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false, // Always use migrations
    logging: process.env.NODE_ENV === 'development',
    entities: [
      AssessmentResult,
      AssessmentSubject,
      Assessment,
      ClassCategory,
      ClassSubject,
      Class,
      FeeType,
      GradeComplaint,
      GradeComplaintHistory,
      Parent,
      SchoolYear,
      Staff,
      Student,
      StudentClass,
      StudentParent,
      StudentPromotion,
      StudentTransfer,
      AssessmentAttendance,
      AssessmentVersion,
      GradeFreezePeriod,
      Subject,
      StudentFee,
      Payment,
      Refund,
      Discount,
      Invoice,
      InvoiceItem,
      Timetable,
      Event,
      EventParticipant,
      Teacher,
      TeachingAssignment,
      Term,
      User,
    ],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    namingStrategy: new SnakeNamingStrategy(),
    migrationsRun: true, // Run migrations on startup for both dev and prod
  }),
);

// Export DataSource for CLI commands
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DB_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'itak_manager',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false, // Always use migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [
    AssessmentResult,
    AssessmentSubject,
    Assessment,
    ClassCategory,
    ClassSubject,
    Class,
    FeeType,
    GradeComplaint,
    GradeComplaintHistory,
    Parent,
    SchoolYear,
    Staff,
    Student,
    StudentClass,
    StudentParent,
    StudentPromotion,
    StudentTransfer,
    AssessmentAttendance,
    AssessmentVersion,
    GradeFreezePeriod,
    Subject,
    StudentFee,
    Payment,
    Refund,
    Discount,
    Invoice,
    InvoiceItem,
    Timetable,
    Event,
    EventParticipant,
    Teacher,
    TeachingAssignment,
    Term,
    User,
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true, // Run migrations on startup for both dev and prod
});
