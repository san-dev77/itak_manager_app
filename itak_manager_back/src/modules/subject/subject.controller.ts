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
import { SubjectService } from './subject.service';
import {
  CreateSubjectDto,
  UpdateSubjectDto,
  SubjectResponseDto,
} from './dto/subject.dto';

@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSubject(
    @Body(ValidationPipe) createSubjectDto: CreateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.createSubject(createSubjectDto);
  }

  @Get()
  async getAllSubjects(): Promise<SubjectResponseDto[]> {
    return this.subjectService.getAllSubjects();
  }

  @Get(':id')
  async getSubjectById(@Param('id') id: string): Promise<SubjectResponseDto> {
    return this.subjectService.getSubjectById(id);
  }

  @Get('code/:code')
  async getSubjectByCode(
    @Param('code') code: string,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.getSubjectByCode(code);
  }

  @Get('name/:name')
  async getSubjectsByName(
    @Param('name') name: string,
  ): Promise<SubjectResponseDto[]> {
    return this.subjectService.getSubjectsByName(name);
  }

  @Put(':id')
  async updateSubject(
    @Param('id') id: string,
    @Body(ValidationPipe) updateSubjectDto: UpdateSubjectDto,
  ): Promise<SubjectResponseDto> {
    return this.subjectService.updateSubject(id, updateSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSubject(@Param('id') id: string): Promise<{ message: string }> {
    return this.subjectService.deleteSubject(id);
  }
}
