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
import { TeacherService } from '../services/teacher.service';
import { CreateTeacherDto, UpdateTeacherDto } from '../dto/teacher.dto';
import type { TeacherResponse } from '../models/teacher.model';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTeacher(
    @Body(ValidationPipe) createTeacherDto: CreateTeacherDto,
  ): Promise<TeacherResponse> {
    return this.teacherService.createTeacher(createTeacherDto);
  }

  @Get()
  async getAllTeachers(): Promise<TeacherResponse[]> {
    return this.teacherService.getAllTeachers();
  }

  @Get(':id')
  async getTeacherById(@Param('id') id: string): Promise<TeacherResponse> {
    return this.teacherService.getTeacherById(parseInt(id, 10));
  }

  @Get('user/:userId')
  async getTeacherByUserId(
    @Param('userId') userId: string,
  ): Promise<TeacherResponse> {
    return this.teacherService.getTeacherByUserId(parseInt(userId, 10));
  }

  @Get('matricule/:matricule')
  async getTeacherByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<TeacherResponse> {
    return this.teacherService.getTeacherByMatricule(matricule);
  }

  @Get('specialty/:specialty')
  async getTeachersBySpecialty(
    @Param('specialty') specialty: string,
  ): Promise<TeacherResponse[]> {
    return this.teacherService.getTeachersBySpecialty(specialty);
  }

  @Put(':id')
  async updateTeacher(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeacherDto: UpdateTeacherDto,
  ): Promise<TeacherResponse> {
    return this.teacherService.updateTeacher(
      parseInt(id, 10),
      updateTeacherDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteTeacher(@Param('id') id: string): Promise<{ message: string }> {
    return this.teacherService.deleteTeacher(parseInt(id, 10));
  }
}
