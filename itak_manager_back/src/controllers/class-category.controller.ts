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
import { ClassCategoryService } from '../services/class-category.service';
import {
  CreateClassCategoryDto,
  UpdateClassCategoryDto,
} from '../dto/class-category.dto';
import type { ClassCategoryResponse } from '../models/class-category.model';

@Controller('class-categories')
export class ClassCategoryController {
  constructor(private readonly classCategoryService: ClassCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClassCategory(
    @Body(ValidationPipe) createClassCategoryDto: CreateClassCategoryDto,
  ): Promise<ClassCategoryResponse> {
    return this.classCategoryService.createClassCategory(
      createClassCategoryDto,
    );
  }

  @Get()
  async getAllClassCategories(): Promise<ClassCategoryResponse[]> {
    return this.classCategoryService.getAllClassCategories();
  }

  @Get(':id')
  async getClassCategoryById(
    @Param('id') id: string,
  ): Promise<ClassCategoryResponse> {
    return this.classCategoryService.getClassCategoryById(parseInt(id, 10));
  }

  @Put(':id')
  async updateClassCategory(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassCategoryDto: UpdateClassCategoryDto,
  ): Promise<ClassCategoryResponse> {
    return this.classCategoryService.updateClassCategory(
      parseInt(id, 10),
      updateClassCategoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteClassCategory(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.classCategoryService.deleteClassCategory(parseInt(id, 10));
  }

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  async initializeDefaultCategories(): Promise<{ message: string }> {
    await this.classCategoryService.initializeDefaultCategories();
    return { message: 'Catégories par défaut initialisées avec succès' };
  }
}
