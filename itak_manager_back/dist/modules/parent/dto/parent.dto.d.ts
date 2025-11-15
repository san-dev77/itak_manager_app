import { UserResponseDto } from '../../user/dto/user.dto';
import { RelationshipType } from '../../../entities/student-parent.entity';
export declare class CreateParentDto {
    userId: string;
    job?: string;
}
declare const UpdateParentDto_base: import("@nestjs/common").Type<Partial<CreateParentDto>>;
export declare class UpdateParentDto extends UpdateParentDto_base {
}
export declare class ParentResponseDto {
    id: string;
    job?: string;
    createdAt: Date;
    updatedAt: Date;
    user?: UserResponseDto;
}
export declare class CreateStudentParentDto {
    studentId: string;
    parentId: string;
    relationship: RelationshipType;
}
export declare class StudentParentResponseDto {
    id: string;
    studentId: string;
    parentId: string;
    relationship: RelationshipType;
    createdAt: Date;
    updatedAt: Date;
}
export {};
