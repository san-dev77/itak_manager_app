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
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { ClassResponseDto } from './dto/class.dto';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createClass(
    @Body(ValidationPipe) createClassDto: CreateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classService.createClass(createClassDto);
  }

  @Get()
  async getAllClasses(): Promise<ClassResponseDto[]> {
    return this.classService.getAllClasses();
  }

  @Get(':id')
  async getClassById(@Param('id') id: string): Promise<ClassResponseDto> {
    return this.classService.getClassById(id);
  }

  @Get('category/:categoryId')
  async getClassesByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<ClassResponseDto[]> {
    return this.classService.getClassesByCategory(categoryId);
  }

  @Get('level/:level')
  async getClassesByLevel(
    @Param('level') level: string,
  ): Promise<ClassResponseDto[]> {
    return this.classService.getClassesByLevel(level);
  }

  @Put(':id')
  async updateClass(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassDto: UpdateClassDto,
  ): Promise<ClassResponseDto> {
    return this.classService.updateClass(id, updateClassDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteClass(@Param('id') id: string): Promise<{ message: string }> {
    return this.classService.deleteClass(id);
  }
}
