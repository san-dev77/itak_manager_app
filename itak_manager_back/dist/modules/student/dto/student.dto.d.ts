import { UserResponseDto } from '../../user/dto/user.dto';
export declare class CreateStudentDto {
    userId: string;
    matricule: string;
    enrollmentDate: string;
    photo?: string;
    maritalStatus?: string;
    fatherName?: string;
    motherName?: string;
    tutorName?: string;
    tutorPhone?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
}
declare const UpdateStudentDto_base: import("@nestjs/common").Type<Partial<CreateStudentDto>>;
export declare class UpdateStudentDto extends UpdateStudentDto_base {
}
export declare class StudentResponseDto {
    id: string;
    userId: string;
    matricule: string;
    enrollmentDate: string | Date;
    photo?: string;
    maritalStatus?: string;
    fatherName?: string;
    motherName?: string;
    tutorName?: string;
    tutorPhone?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    user?: UserResponseDto;
}
export {};
