import { TermService } from './term.service';
import { CreateTermDto, UpdateTermDto, TermResponseDto } from './dto/term.dto';
export declare class TermController {
    private readonly termService;
    constructor(termService: TermService);
    createTerm(createTermDto: CreateTermDto): Promise<TermResponseDto>;
    getAllTerms(): Promise<TermResponseDto[]>;
    getActiveTerm(): Promise<TermResponseDto>;
    getTermsBySchoolYear(schoolYearId: string): Promise<TermResponseDto[]>;
    getTermById(id: string): Promise<TermResponseDto>;
    updateTerm(id: string, updateTermDto: UpdateTermDto): Promise<TermResponseDto>;
    deleteTerm(id: string): Promise<void>;
    setActiveTerm(id: string): Promise<TermResponseDto>;
}
