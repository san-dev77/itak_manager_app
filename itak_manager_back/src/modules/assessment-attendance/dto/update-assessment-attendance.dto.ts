import { PartialType } from '@nestjs/mapped-types';
import { CreateAssessmentAttendanceDto } from './create-assessment-attendance.dto';

export class UpdateAssessmentAttendanceDto extends PartialType(
  CreateAssessmentAttendanceDto,
) {}
