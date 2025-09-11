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
import { StudentTransferService } from './student-transfer.service';
import { CreateStudentTransferDto } from './dto/create-student-transfer.dto';
import { UpdateStudentTransferDto } from './dto/update-student-transfer.dto';
import { UpdateStudentClassStatusDto } from './dto/update-student-class-status.dto';
import { StudentTransferResponseDto } from './dto/student-transfer-response.dto';
import { TransferReason } from '../../entities/student-transfer.entity';

@Controller('student-transfers')
export class StudentTransferController {
  constructor(
    private readonly studentTransferService: StudentTransferService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateStudentTransferDto,
  ): Promise<StudentTransferResponseDto> {
    return this.studentTransferService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('studentId') studentId?: string,
    @Query('year') year?: string,
    @Query('reason') reason?: TransferReason,
    @Query('fromClassId') fromClassId?: string,
    @Query('toClassId') toClassId?: string,
  ): Promise<StudentTransferResponseDto[]> {
    return this.studentTransferService.findAll({
      studentId,
      year,
      reason,
      fromClassId,
      toClassId,
    });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StudentTransferResponseDto> {
    return this.studentTransferService.findOne(id);
  }

  @Get('student/:studentId')
  async findByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Query('year') year?: string,
  ): Promise<StudentTransferResponseDto[]> {
    return this.studentTransferService.findAll({ studentId, year });
  }

  @Get('class/:classId/from')
  async findTransfersFromClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('year') year?: string,
  ): Promise<StudentTransferResponseDto[]> {
    return this.studentTransferService.findAll({ fromClassId: classId, year });
  }

  @Get('class/:classId/to')
  async findTransfersToClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('year') year?: string,
  ): Promise<StudentTransferResponseDto[]> {
    return this.studentTransferService.findAll({ toClassId: classId, year });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStudentTransferDto,
  ): Promise<StudentTransferResponseDto> {
    return this.studentTransferService.update(id, updateDto);
  }

  @Post(':id/execute')
  @HttpCode(HttpStatus.NO_CONTENT)
  async executeTransfer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.studentTransferService.executeTransfer(id);
  }

  @Post(':id/reverse')
  @HttpCode(HttpStatus.NO_CONTENT)
  async reverseTransfer(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.studentTransferService.reverseTransfer(id);
  }

  @Patch('student-class/:studentId/:classId/:year/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateStudentClassStatus(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Param('classId', ParseUUIDPipe) classId: string,
    @Param('year') year: string,
    @Body() updateDto: UpdateStudentClassStatusDto,
  ): Promise<void> {
    return this.studentTransferService.updateStudentClassStatus(
      studentId,
      classId,
      year,
      updateDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.studentTransferService.remove(id);
  }
}
