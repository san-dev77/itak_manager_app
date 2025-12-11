import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from './student.service';
import {
  CreateStudentDto,
  UpdateStudentDto,
  StudentResponseDto,
} from './dto/student.dto';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudent(
    @Body(ValidationPipe) createStudentDto: CreateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()
  async getAllStudents(
    @Query('institutionId') institutionId?: string,
  ): Promise<StudentResponseDto[]> {
    return this.studentService.getAllStudents(institutionId);
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<StudentResponseDto> {
    return this.studentService.getStudentById(id);
  }

  @Get('user/:userId')
  async getStudentByUserId(
    @Param('userId') userId: string,
  ): Promise<StudentResponseDto> {
    return this.studentService.getStudentByUserId(userId);
  }

  @Get('matricule/:matricule')
  async getStudentByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<StudentResponseDto> {
    return this.studentService.getStudentByMatricule(matricule);
  }

  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponseDto> {
    return this.studentService.updateStudent(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: string): Promise<{ message: string }> {
    return this.studentService.deleteStudent(id);
  }
}
