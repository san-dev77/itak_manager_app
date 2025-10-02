import {
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  Min,
} from "class-validator";
import { FeeFrequency } from "../entities/fee-type.entity";

export class CreateFeeTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  amountDefault: number;

  @IsBoolean()
  isRecurring: boolean;

  @IsEnum(FeeFrequency)
  frequency: FeeFrequency;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateFeeTypeDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amountDefault?: number;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsEnum(FeeFrequency)
  frequency?: FeeFrequency;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
