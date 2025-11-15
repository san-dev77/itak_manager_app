import { StudentResponseDto } from '../../student/dto/student.dto';
import { ClassResponseDto } from '../../class/dto/class.dto';
export declare class CreatePromotionDto {
    studentId: string;
    toClassId: string;
    year: string;
    remarks?: string;
}
export declare class BulkPromotionDto {
    fromClassId: string;
    toClassId: string;
    year: string;
    remarks?: string;
}
export declare class PromotionResponseDto {
    student: StudentResponseDto;
    fromClass: ClassResponseDto;
    toClass: ClassResponseDto;
    year: string;
    remarks?: string;
    createdAt: Date;
}
export declare class NextClassResponseDto {
    currentClass: ClassResponseDto;
    nextClass: ClassResponseDto | null;
    canPromote: boolean;
    message: string;
}
