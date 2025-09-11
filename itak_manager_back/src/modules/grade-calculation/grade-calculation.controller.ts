import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { GradeCalculationService } from './grade-calculation.service';
import {
  TermGradesResponseDto,
  ClassAverageDto,
} from './dto/term-grades-response.dto';

@Controller('grade-calculation')
export class GradeCalculationController {
  constructor(
    private readonly gradeCalculationService: GradeCalculationService,
  ) {}

  @Get('student/:studentId/term/:termId')
  async getStudentTermGrades(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('termId', ParseUUIDPipe) termId: string,
  ): Promise<TermGradesResponseDto> {
    return this.gradeCalculationService.calculateTermGrades(studentId, termId);
  }

  @Get('student/:studentId/year/:schoolYearId')
  async getStudentYearGrades(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('schoolYearId', ParseUUIDPipe) schoolYearId: string,
  ): Promise<TermGradesResponseDto[]> {
    return this.gradeCalculationService.calculateYearGrades(
      studentId,
      schoolYearId,
    );
  }

  @Get('class/:classId/term/:termId/averages')
  async getClassAverages(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('termId', ParseUUIDPipe) termId: string,
  ): Promise<ClassAverageDto[]> {
    return this.gradeCalculationService.calculateClassAverages(classId, termId);
  }
}
