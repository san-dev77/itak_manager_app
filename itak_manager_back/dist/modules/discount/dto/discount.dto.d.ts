import { DiscountType } from '../../../entities/discount.entity';
import { StudentFeeResponseDto } from '../../student-fee/dto/student-fee.dto';
import { UserResponseDto } from '../../user/dto/user.dto';
export declare class CreateDiscountDto {
    studentFeeId: string;
    type: DiscountType;
    description?: string;
    amount: number;
    approvedBy: string;
}
declare const UpdateDiscountDto_base: import("@nestjs/common").Type<Partial<CreateDiscountDto>>;
export declare class UpdateDiscountDto extends UpdateDiscountDto_base {
}
export declare class DiscountResponseDto {
    id: string;
    studentFeeId: string;
    type: DiscountType;
    description?: string;
    amount: number;
    approvedBy: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    studentFee?: StudentFeeResponseDto;
    approvedByUser?: UserResponseDto;
}
export {};
