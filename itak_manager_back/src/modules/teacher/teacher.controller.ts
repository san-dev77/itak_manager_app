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
import { TeacherService } from './teacher.service';
import {
  CreateTeacherDto,
  UpdateTeacherDto,
  TeacherResponseDto,
} from './dto/teacher.dto';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTeacher(
    @Body(ValidationPipe) createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Get()
  async getAllTeachers(): Promise<TeacherResponseDto[]> {
    return this.teacherService.getAllTeachers();
  }

  @Get(':id')
  async getTeacherById(@Param('id') id: string): Promise<TeacherResponseDto> {
    return this.teacherService.getTeacherById(id);
  }

  @Get('user/:userId')
  async getTeacherByUserId(
    @Param('userId') userId: string,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.getTeacherByUserId(userId);
  }

  @Get('matricule/:matricule')
  async getTeacherByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.getTeacherByMatricule(matricule);
  }

  @Get('subject/:subjectId')
  async getTeachersBySubject(
    @Param('subjectId') subjectId: string,
  ): Promise<TeacherResponseDto[]> {
    return this.teacherService.getTeachersBySubject(subjectId);
  }

  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponseDto> {
    return this.teacherService.updateTeacher(id, updateTeacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTeacher(@Param('id') id: string): Promise<{ message: string }> {
    return this.teacherService.deleteTeacher(id);
  }
}
