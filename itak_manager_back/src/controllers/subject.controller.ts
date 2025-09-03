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
import { SubjectService } from '../services/subject.service';
import { CreateSubjectDto, UpdateSubjectDto } from '../dto/subject.dto';
import type { SubjectResponse } from '../models/subject.model';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSubject(
    @Body(ValidationPipe) createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponse> {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  async getAllSubjects(): Promise<SubjectResponse[]> {
    return this.subjectService.getAllSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id') id: string): Promise<SubjectResponse> {
    return this.subjectService.getSubjectById(parseInt(id, 10));
  }

  @Get('code/:code')
  async getSubjectByCode(
    @Param('code') code: string,
  ): Promise<SubjectResponse> {
    return this.subjectService.getSubjectByCode(code);
  }

  @Get('name/:name')
  async getSubjectsByName(
    @Param('name') name: string,
  ): Promise<SubjectResponse[]> {
    return this.subjectService.getSubjectsByName(name);
  }

  @Get('category/:categoryId')
  async getSubjectsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<SubjectResponse[]> {
    return this.subjectService.getSubjectsByCategory(parseInt(categoryId, 10));
  }

  @Put(':id')
  async updateSubject(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponse> {
    return this.subjectService.updateSubject(
      parseInt(id, 10),
      updateSubjectDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubject(@Param('id') id: string): Promise<{ message: string }> {
    return this.subjectService.deleteSubject(parseInt(id, 10));
  }
}
