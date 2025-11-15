import { Repository } from 'typeorm';
import { SchoolYear } from '../../entities/school-year.entity';
import { Term } from '../../entities/term.entity';
import { CreateSchoolYearDto, UpdateSchoolYearDto, SchoolYearResponseDto } from './dto/school-year.dto';
export declare class SchoolYearService {
    private schoolYearRepository;
    private termRepository;
    constructor(schoolYearRepository: Repository<SchoolYear>, termRepository: Repository<Term>);
    createSchoolYear(createSchoolYearDto: CreateSchoolYearDto): Promise<SchoolYearResponseDto>;
    getAllSchoolYears(): Promise<SchoolYearResponseDto[]>;
    getSchoolYearById(id: string): Promise<SchoolYearResponseDto>;
    getActiveSchoolYear(): Promise<SchoolYearResponseDto>;
    updateSchoolYear(id: string, updateSchoolYearDto: UpdateSchoolYearDto): Promise<SchoolYearResponseDto>;
    deleteSchoolYear(id: string): Promise<void>;
    setActiveSchoolYear(id: string): Promise<SchoolYearResponseDto>;
    private mapToSchoolYearResponseDto;
}
