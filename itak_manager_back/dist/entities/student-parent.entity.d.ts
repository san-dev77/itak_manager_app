import { Student } from './student.entity';
import { Parent } from './parent.entity';
export declare enum RelationshipType {
    FATHER = "p\u00E8re",
    MOTHER = "m\u00E8re",
    GUARDIAN = "tuteur",
    STEPFATHER = "beau-p\u00E8re",
    STEPMOTHER = "belle-m\u00E8re",
    GRANDFATHER = "grand-p\u00E8re",
    GRANDMOTHER = "grand-m\u00E8re",
    OTHER = "autre"
}
export declare class StudentParent {
    id: string;
    studentId: string;
    parentId: string;
    relationship: RelationshipType;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    parent: Parent;
}
