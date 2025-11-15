import { SchoolYearResponseDto } from '../../school-year/dto/school-year.dto';
export declare class CreateTermDto {
    schoolYearId: string;
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    orderNumber?: number;
}
declare const UpdateTermDto_base: import("@nestjs/common").Type<Partial<CreateTermDto>>;
export declare class UpdateTermDto extends UpdateTermDto_base {
}
export declare class TermResponseDto {
    id: string;
    schoolYearId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    orderNumber: number;
    createdAt: Date;
    updatedAt: Date;
    schoolYear?: SchoolYearResponseDto;
}
export {};
