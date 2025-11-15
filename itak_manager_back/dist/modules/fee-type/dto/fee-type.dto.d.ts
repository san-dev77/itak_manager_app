import { FeeFrequency } from '../../../entities/fee-type.entity';
export declare class CreateFeeTypeDto {
    name: string;
    description?: string;
    amountDefault: number;
    isRecurring?: boolean;
    frequency?: FeeFrequency;
}
declare const UpdateFeeTypeDto_base: import("@nestjs/common").Type<Partial<CreateFeeTypeDto>>;
export declare class UpdateFeeTypeDto extends UpdateFeeTypeDto_base {
}
export declare class FeeTypeResponseDto {
    id: string;
    name: string;
    description?: string;
    amountDefault: number;
    isRecurring: boolean;
    frequency?: FeeFrequency;
    createdAt: string | Date;
    updatedAt: string | Date;
}
export {};
