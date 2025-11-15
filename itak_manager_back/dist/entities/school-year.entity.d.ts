import { Term } from './term.entity';
import { Assessment } from './assessment.entity';
export declare class SchoolYear {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    terms: Term[];
    assessments: Assessment[];
}
