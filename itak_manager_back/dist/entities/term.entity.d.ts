import { SchoolYear } from './school-year.entity';
import { Assessment } from './assessment.entity';
export declare class Term {
    id: string;
    schoolYearId: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    orderNumber: number;
    createdAt: Date;
    updatedAt: Date;
    schoolYear: SchoolYear;
    assessments: Assessment[];
}
