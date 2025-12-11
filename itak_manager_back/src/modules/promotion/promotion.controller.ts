import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import {
  CreatePromotionDto,
  BulkPromotionDto,
  PromotionResponseDto,
  NextClassResponseDto,
} from './dto/promotion.dto';
import { Class } from '../../entities/class.entity';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get('next-class/:classId')
  @ApiOperation({
    summary: 'Obtenir la classe supérieure pour une classe donnée',
  })
  @ApiParam({ name: 'classId', description: 'ID de la classe actuelle' })
  @ApiResponse({
    status: 200,
    description: 'Informations sur la classe supérieure',
    type: NextClassResponseDto,
  })
  async getNextClass(
    @Param('classId') classId: string,
  ): Promise<NextClassResponseDto> {
    try {
      return await this.promotionService.getNextClass(classId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('promote-student')
  @ApiOperation({
    summary: 'Promouvoir un étudiant vers une classe supérieure',
  })
  @ApiBody({ type: CreatePromotionDto })
  @ApiResponse({
    status: 201,
    description: 'Étudiant promu avec succès',
    type: PromotionResponseDto,
  })
  async promoteStudent(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<PromotionResponseDto> {
    try {
      return await this.promotionService.promoteStudent(createPromotionDto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('bulk-promote')
  @ApiOperation({
    summary:
      "Promouvoir tous les étudiants d'une classe vers une classe supérieure",
  })
  @ApiBody({ type: BulkPromotionDto })
  @ApiResponse({
    status: 201,
    description: 'Étudiants promus en masse avec succès',
    type: [PromotionResponseDto],
  })
  async bulkPromoteClass(
    @Body() bulkPromotionDto: BulkPromotionDto,
  ): Promise<PromotionResponseDto[]> {
    try {
      return await this.promotionService.bulkPromoteClass(bulkPromotionDto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('history/:studentId')
  @ApiOperation({
    summary: "Obtenir l'historique des promotions d'un étudiant",
  })
  @ApiParam({ name: 'studentId', description: "ID de l'étudiant" })
  @ApiResponse({
    status: 200,
    description: 'Historique des promotions',
    type: [PromotionResponseDto],
  })
  async getPromotionHistory(
    @Param('studentId') studentId: string,
  ): Promise<PromotionResponseDto[]> {
    try {
      return await this.promotionService.getPromotionHistory(studentId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('classes-by-level/:categoryId')
  @ApiOperation({
    summary:
      "Obtenir les classes d'une catégorie triées par niveau hiérarchique",
  })
  @ApiParam({ name: 'categoryId', description: 'ID de la catégorie de classe' })
  @ApiResponse({
    status: 200,
    description: 'Liste des classes triées par niveau',
    type: [Class],
  })
  async getClassesByOrderLevel(
    @Param('categoryId') categoryId: string,
  ): Promise<Class[]> {
    try {
      return await this.promotionService.getClassesByOrderLevel(categoryId);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
