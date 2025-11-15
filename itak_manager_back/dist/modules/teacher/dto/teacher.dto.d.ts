import { UserResponseDto } from '../../user/dto/user.dto';
import { Subject } from '../../../entities/subject.entity';
export declare class CreateTeacherDto {
    userId: string;
    matricule: string;
    hireDate: string;
    photo?: string;
    maritalStatus?: string;
    subjectIds?: string[];
    diplomas?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
}
declare const UpdateTeacherDto_base: import("@nestjs/common").Type<Partial<CreateTeacherDto>>;
export declare class UpdateTeacherDto extends UpdateTeacherDto_base {
}
export declare class TeacherResponseDto {
    id: string;
    matricule: string;
    hireDate: Date;
    photo?: string;
    maritalStatus?: string;
    subjects: Subject[];
    diplomas?: string;
    address?: string;
    emergencyContact?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: UserResponseDto;
}
export {};
