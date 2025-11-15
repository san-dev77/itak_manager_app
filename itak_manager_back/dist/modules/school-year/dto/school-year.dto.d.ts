import { TermResponseDto } from '../../term/dto/term.dto';
export declare class CreateSchoolYearDto {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
}
declare const UpdateSchoolYearDto_base: import("@nestjs/common").Type<Partial<CreateSchoolYearDto>>;
export declare class UpdateSchoolYearDto extends UpdateSchoolYearDto_base {
}
export declare class SchoolYearResponseDto {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    terms?: TermResponseDto[];
}
export {};
