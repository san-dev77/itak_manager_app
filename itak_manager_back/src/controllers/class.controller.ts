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
import { ClassService } from '../services/class.service';
import { CreateClassDto, UpdateClassDto } from '../dto/class.dto';
import type { ClassResponse } from '../models/class.model';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClass(
    @Body(ValidationPipe) createClassDto: CreateClassDto,
  ): Promise<ClassResponse> {
    return this.classService.createClass(createClassDto);
  }

  @Get()
  async getAllClasses(): Promise<ClassResponse[]> {
    return this.classService.getAllClasses();
  }

  @Get(':id')
  async getClassById(@Param('id') id: string): Promise<ClassResponse> {
    return this.classService.getClassById(parseInt(id, 10));
  }

  @Get('category/:categoryId')
  async getClassesByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ClassResponse[]> {
    return this.classService.getClassesByCategory(parseInt(categoryId, 10));
  }

  @Get('level/:level')
  async getClassesByLevel(
    @Param('level') level: string,
  ): Promise<ClassResponse[]> {
    return this.classService.getClassesByLevel(level);
  }

  @Put(':id')
  async updateClass(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassDto: UpdateClassDto,
  ): Promise<ClassResponse> {
    return this.classService.updateClass(parseInt(id, 10), updateClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteClass(@Param('id') id: string): Promise<{ message: string }> {
    return this.classService.deleteClass(parseInt(id, 10));
  }
}
