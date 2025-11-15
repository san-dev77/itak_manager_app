import { User } from './user.entity';
import { StudentParent } from './student-parent.entity';
export declare class Parent {
    id: string;
    userId: string;
    job?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    studentParents: StudentParent[];
}
