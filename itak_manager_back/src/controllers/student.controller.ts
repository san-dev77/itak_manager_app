import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { CreateStudentDto, UpdateStudentDto } from '../dto/student.dto';
import type { StudentResponse } from '../models/student.model';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStudent(
    @Body(ValidationPipe) createStudentDto: CreateStudentDto,
  ): Promise<StudentResponse> {
    return this.studentService.createStudent(createStudentDto);
  }

  @Get()
  async getAllStudents(): Promise<StudentResponse[]> {
    return this.studentService.getAllStudents();
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string): Promise<StudentResponse> {
    return this.studentService.getStudentById(parseInt(id, 10));
  }

  @Get('user/:userId')
  async getStudentByUserId(
    @Param('userId') userId: string,
  ): Promise<StudentResponse> {
    return this.studentService.getStudentByUserId(parseInt(userId, 10));
  }

  @Get('matricule/:matricule')
  async getStudentByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<StudentResponse> {
    return this.studentService.getStudentByMatricule(matricule);
  }

  @Put(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStudentDto: UpdateStudentDto,
  ): Promise<StudentResponse> {
    return this.studentService.updateStudent(
      parseInt(id, 10),
      updateStudentDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStudent(@Param('id') id: string): Promise<{ message: string }> {
    return this.studentService.deleteStudent(parseInt(id, 10));
  }
}
