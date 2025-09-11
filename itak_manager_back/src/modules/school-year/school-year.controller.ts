import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpException,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { SchoolYearService } from './school-year.service';
import {
  CreateSchoolYearDto,
  UpdateSchoolYearDto,
  SchoolYearResponseDto,
} from './dto/school-year.dto';

@ApiTags('Années Scolaires')
@Controller('school-years')
export class SchoolYearController {
  constructor(private readonly schoolYearService: SchoolYearService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle année scolaire' })
  @ApiBody({ type: CreateSchoolYearDto })
  @ApiResponse({
    status: 201,
    description: 'Année scolaire créée avec succès',
    type: SchoolYearResponseDto,
  })
  async createSchoolYear(
    @Body() createSchoolYearDto: CreateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    try {
      return await this.schoolYearService.createSchoolYear(createSchoolYearDto);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les années scolaires' })
  @ApiResponse({
    status: 200,
    description: 'Liste des années scolaires',
    type: [SchoolYearResponseDto],
  })
  async getAllSchoolYears(): Promise<SchoolYearResponseDto[]> {
    try {
      return await this.schoolYearService.getAllSchoolYears();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('active')
  @ApiOperation({ summary: "Récupérer l'année scolaire active" })
  @ApiResponse({
    status: 200,
    description: 'Année scolaire active',
    type: SchoolYearResponseDto,
  })
  async getActiveSchoolYear(): Promise<SchoolYearResponseDto> {
    try {
      return await this.schoolYearService.getActiveSchoolYear();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une année scolaire par ID' })
  @ApiParam({ name: 'id', description: "ID de l'année scolaire" })
  @ApiResponse({
    status: 200,
    description: 'Année scolaire trouvée',
    type: SchoolYearResponseDto,
  })
  async getSchoolYearById(
    @Param('id') id: string,
  ): Promise<SchoolYearResponseDto> {
    try {
      return await this.schoolYearService.getSchoolYearById(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une année scolaire' })
  @ApiParam({ name: 'id', description: "ID de l'année scolaire" })
  @ApiBody({ type: UpdateSchoolYearDto })
  @ApiResponse({
    status: 200,
    description: 'Année scolaire mise à jour avec succès',
    type: SchoolYearResponseDto,
  })
  async updateSchoolYear(
    @Param('id') id: string,
    @Body() updateSchoolYearDto: UpdateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    try {
      return await this.schoolYearService.updateSchoolYear(
        id,
        updateSchoolYearDto,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une année scolaire' })
  @ApiParam({ name: 'id', description: "ID de l'année scolaire" })
  @ApiResponse({
    status: 200,
    description: 'Année scolaire supprimée avec succès',
  })
  async deleteSchoolYear(@Param('id') id: string): Promise<void> {
    try {
      await this.schoolYearService.deleteSchoolYear(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activer une année scolaire' })
  @ApiParam({ name: 'id', description: "ID de l'année scolaire" })
  @ApiResponse({
    status: 200,
    description: 'Année scolaire activée avec succès',
    type: SchoolYearResponseDto,
  })
  async setActiveSchoolYear(
    @Param('id') id: string,
  ): Promise<SchoolYearResponseDto> {
    try {
      return await this.schoolYearService.setActiveSchoolYear(id);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
