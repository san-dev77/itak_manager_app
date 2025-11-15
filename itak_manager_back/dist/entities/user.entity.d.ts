import { Student } from './student.entity';
import { Teacher } from './teacher.entity';
import { Staff } from './staff.entity';
import { Parent } from './parent.entity';
import { GradeComplaintHistory } from './grade-complaint-history.entity';
import { AssessmentSubject } from './assessment-subject.entity';
import { Payment } from './payment.entity';
import { Refund } from './refund.entity';
import { Discount } from './discount.entity';
export declare enum UserRole {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
    TEACHER = "teacher",
    STUDENT = "student",
    STAFF = "staff",
    PARENT = "parent"
}
export declare class User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    gender?: string;
    birthDate?: Date;
    phone?: string;
    password: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    students: Student[];
    teachers: Teacher[];
    staff: Staff[];
    parents: Parent[];
    gradeComplaintHistory: GradeComplaintHistory[];
    assessmentSubjects: AssessmentSubject[];
    receivedPayments: Payment[];
    processedRefunds: Refund[];
    approvedDiscounts: Discount[];
}
