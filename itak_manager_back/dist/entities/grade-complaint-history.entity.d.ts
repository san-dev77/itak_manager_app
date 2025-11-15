import { GradeComplaint } from './grade-complaint.entity';
import { User } from './user.entity';
export declare class GradeComplaintHistory {
    id: string;
    complaintId: string;
    oldScore: number;
    newScore: number;
    changedBy: string;
    changedAt: Date;
    comment: string;
    complaint: GradeComplaint;
    changedByUser: User;
}
