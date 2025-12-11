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
import { ClassCategoryService } from './class-category.service';
import {
  CreateClassCategoryDto,
  UpdateClassCategoryDto,
  ClassCategoryResponseDto,
} from './dto/class-category.dto';

@Controller('class-categories')
export class ClassCategoryController {
  constructor(private readonly classCategoryService: ClassCategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClassCategory(
    @Body(ValidationPipe) createClassCategoryDto: CreateClassCategoryDto,
  ): Promise<ClassCategoryResponseDto> {
    return this.classCategoryService.createClassCategory(
      createClassCategoryDto,
    );
  }

  @Get()
  async getAllClassCategories(
    @Query('institutionId') institutionId?: string,
  ): Promise<ClassCategoryResponseDto[]> {
    return this.classCategoryService.getAllClassCategories(institutionId);
  }

  @Get(':id')
  async getClassCategoryById(
    @Param('id') id: string,
  ): Promise<ClassCategoryResponseDto> {
    return this.classCategoryService.getClassCategoryById(id);
  }

  @Put(':id')
  async updateClassCategory(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassCategoryDto: UpdateClassCategoryDto,
  ): Promise<ClassCategoryResponseDto> {
    return this.classCategoryService.updateClassCategory(
      id,
      updateClassCategoryDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteClassCategory(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.classCategoryService.deleteClassCategory(id);
  }

  @Post('initialize')
  @HttpCode(HttpStatus.OK)
  async initializeDefaultCategories(): Promise<{ message: string }> {
    await this.classCategoryService.initializeDefaultCategories();
    return { message: 'Catégories par défaut initialisées avec succès' };
  }

  @Get('institutions/all')
  async getAllInstitutions() {
    return this.classCategoryService.getAllInstitutions();
  }
}
