import { PartialType } from '@nestjs/mapped-types';
import { CreateFreezePeriodDto } from './create-freeze-period.dto';

export class UpdateFreezePeriodDto extends PartialType(CreateFreezePeriodDto) {}
