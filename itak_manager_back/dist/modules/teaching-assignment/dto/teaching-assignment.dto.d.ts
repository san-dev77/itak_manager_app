import { ClassResponseDto } from '../../class/dto/class.dto';
import { SubjectResponseDto } from '../../subject/dto/subject.dto';
import { ClassSubjectResponseDto } from '../../class-subject/dto/class-subject.dto';
import { TeacherResponseDto } from '../../teacher/dto/teacher.dto';
export declare class CreateTeachingAssignmentDto {
    teacherId: string;
    classSubjectId: string;
    startDate: string | Date;
    endDate?: string | Date;
}
declare const UpdateTeachingAssignmentDto_base: import("@nestjs/common").Type<Partial<CreateTeachingAssignmentDto>>;
export declare class UpdateTeachingAssignmentDto extends UpdateTeachingAssignmentDto_base {
}
export declare class TeachingAssignmentResponseDto {
    id: string;
    startDate: Date;
    endDate?: Date;
    teacher?: TeacherResponseDto;
    classSubject?: ClassSubjectResponseDto;
    coefficient: number;
    class: ClassResponseDto;
    subject: SubjectResponseDto;
    createdAt: Date;
    updatedAt: Date;
}
export {};
