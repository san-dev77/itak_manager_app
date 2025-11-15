import { Repository } from 'typeorm';
import { Term } from '../../entities/term.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import { CreateTermDto, UpdateTermDto, TermResponseDto } from './dto/term.dto';
export declare class TermService {
    private termRepository;
    private schoolYearRepository;
    constructor(termRepository: Repository<Term>, schoolYearRepository: Repository<SchoolYear>);
    createTerm(createTermDto: CreateTermDto): Promise<TermResponseDto>;
    getAllTerms(): Promise<TermResponseDto[]>;
    getTermById(id: string): Promise<TermResponseDto>;
    getTermsBySchoolYear(schoolYearId: string): Promise<TermResponseDto[]>;
    getActiveTerm(): Promise<TermResponseDto>;
    updateTerm(id: string, updateTermDto: UpdateTermDto): Promise<TermResponseDto>;
    deleteTerm(id: string): Promise<void>;
    setActiveTerm(id: string): Promise<TermResponseDto>;
    private mapToTermResponseDto;
}
