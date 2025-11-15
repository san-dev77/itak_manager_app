import { User } from './user.entity';
import { TeachingAssignment } from './teaching-assignment.entity';
import { Subject } from './subject.entity';
export declare class Teacher {
    id: string;
    userId: string;
    matricule: string;
    hireDate: Date;
    photo?: string;
    maritalStatus?: string;
    diplomas?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    teachingAssignments: TeachingAssignment[];
    subjects: Subject[];
}
