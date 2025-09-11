import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  User,
  Student,
  Teacher,
  Staff,
  ClassCategory,
  Subject,
  Class,
  ClassSubject,
  StudentClass,
  TeachingAssignment,
  Parent,
  StudentParent,
} from '../entities';
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

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    url: process.env.DB_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
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
  password: process.env.DB_PASSWORD || 'password',
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
    GradeComplaintHistory,
    GradeComplaint,
    Parent,
    SchoolYear,
    Staff,
    StudentClass,
    StudentParent,
    StudentPromotion,
    StudentTransfer,
    Student,
    AssessmentAttendance,
    AssessmentVersion,
    GradeFreezePeriod,
    Subject,
    Teacher,
    TeachingAssignment,
    Term,
    User,
  ],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: true, // Run migrations on startup for both dev and prod
});
