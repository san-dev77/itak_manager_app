import { AttendanceStatus } from '../../../entities/assessment-attendance.entity';

export class AssessmentAttendanceResponseDto {
  assessmentId: string;
  studentId: string;
  status: AttendanceStatus;
  reason?: string;
  markedBy?: string;
  markedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Related data
  assessment?: {
    id: string;
    title: string;
    type: string;
    startDate: Date;
    endDate: Date;
  };

  student?: {
    id: string;
    matricule: string;
    firstName: string;
    lastName: string;
  };
}
