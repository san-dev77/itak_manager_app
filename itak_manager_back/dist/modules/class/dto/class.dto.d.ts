import { ClassCategoryResponseDto } from '../../class-category/dto/class-category.dto';
import { ClassSubjectResponseDto } from '../../class-subject/dto/class-subject.dto';
import { StudentClassResponseDto } from '../../student-class/dto/student-class.dto';
export declare class CreateClassDto {
    name: string;
    code: string;
    classCategoryId: string;
    description?: string;
    level?: string;
    capacity?: number;
    orderLevel: number;
}
declare const UpdateClassDto_base: import("@nestjs/common").Type<Partial<CreateClassDto>>;
export declare class UpdateClassDto extends UpdateClassDto_base {
}
export declare class ClassResponseDto {
    id: string;
    name: string;
    code: string;
    classCategory: ClassCategoryResponseDto;
    description: string;
    level?: string;
    capacity?: number;
    orderLevel: number;
    createdAt: Date;
    updatedAt: Date;
    classSubjects: ClassSubjectResponseDto[];
    studentClasses: StudentClassResponseDto[];
}
export {};
