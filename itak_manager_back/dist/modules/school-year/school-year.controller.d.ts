import { SchoolYearService } from './school-year.service';
import { CreateSchoolYearDto, UpdateSchoolYearDto, SchoolYearResponseDto } from './dto/school-year.dto';
export declare class SchoolYearController {
    private readonly schoolYearService;
    constructor(schoolYearService: SchoolYearService);
    createSchoolYear(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYearResponseDto>;
    getAllSchoolYears(): Promise<SchoolYearResponseDto[]>;
    getActiveSchoolYear(): Promise<SchoolYearResponseDto>;
    getSchoolYearById(id: string): Promise<SchoolYearResponseDto>;
    updateSchoolYear(id: string, updateSchoolYearDto: UpdateSchoolYearDto): Promise<SchoolYearResponseDto>;
    deleteSchoolYear(id: string): Promise<void>;
    setActiveSchoolYear(id: string): Promise<SchoolYearResponseDto>;
}
