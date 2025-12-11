import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssessmentAttendanceService } from './assessment-attendance.service';
import { CreateAssessmentAttendanceDto } from './dto/create-assessment-attendance.dto';
import { UpdateAssessmentAttendanceDto } from './dto/update-assessment-attendance.dto';
import { BulkCreateAttendanceDto } from './dto/bulk-create-attendance.dto';
import { AttendanceStatus } from '../../entities/assessment-attendance.entity';

@Controller('assessment-attendance')
export class AssessmentAttendanceController {
  constructor(
    private readonly attendanceService: AssessmentAttendanceService,
  ) {}

  @Post()
  create(@Body() createDto: CreateAssessmentAttendanceDto) {
    return this.attendanceService.create(createDto);
  }

  @Post('bulk')
  bulkCreate(@Body() bulkDto: BulkCreateAttendanceDto) {
    return this.attendanceService.bulkCreate(bulkDto);
  }

  @Get()
  findAll(
    @Query('assessmentId') assessmentId?: string,
    @Query('studentId') studentId?: string,
    @Query('status') status?: AttendanceStatus,
  ) {
    return this.attendanceService.findAll({
      assessmentId,
      studentId,
      status,
    });
  }

  @Get('assessment/:assessmentId')
  findByAssessment(@Param('assessmentId', ParseUUIDPipe) assessmentId: string) {
    return this.attendanceService.findByAssessment(assessmentId);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }

  @Get('stats/:assessmentId')
  getAttendanceStats(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ) {
    return this.attendanceService.getAttendanceStats(assessmentId);
  }

  @Get(':assessmentId/:studentId')
  findOne(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.attendanceService.findOne(assessmentId, studentId);
  }

  @Patch(':assessmentId/:studentId')
  update(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() updateDto: UpdateAssessmentAttendanceDto,
  ) {
    return this.attendanceService.update(assessmentId, studentId, updateDto);
  }

  @Delete(':assessmentId/:studentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.attendanceService.remove(assessmentId, studentId);
  }
}
