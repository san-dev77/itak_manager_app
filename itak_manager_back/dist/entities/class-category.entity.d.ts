import { Class } from './class.entity';
export declare class ClassCategory {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    classes: Class[];
}
