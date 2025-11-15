import { User } from './user.entity';
export declare enum ParticipantRole {
    STUDENT = "student",
    TEACHER = "teacher",
    STAFF = "staff",
    OTHER = "other"
}
export declare enum ParticipantStatus {
    INVITED = "invited",
    CONFIRMED = "confirmed",
    DECLINED = "declined",
    ABSENT = "absent"
}
export declare class EventParticipant {
    id: string;
    eventId: string;
    userId: string;
    role: ParticipantRole;
    status: ParticipantStatus;
    event: any;
    user: User;
}
