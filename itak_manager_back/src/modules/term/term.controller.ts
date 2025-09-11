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
import { TermService } from './term.service';
import {
  CreateTermDto,
  UpdateTermDto,
  TermResponseDto,
} from './dto/term.dto';

@ApiTags('Trimestres')
@Controller('terms')
export class TermController {
  constructor(private readonly termService: TermService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau trimestre' })
  @ApiBody({ type: CreateTermDto })
  @ApiResponse({
    status: 201,
    description: 'Trimestre créé avec succès',
    type: TermResponseDto,
  })
  async createTerm(
    @Body() createTermDto: CreateTermDto,
  ): Promise<TermResponseDto> {
    try {
      return await this.termService.createTerm(createTermDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les trimestres' })
  @ApiResponse({
    status: 200,
    description: 'Liste des trimestres',
    type: [TermResponseDto],
  })
  async getAllTerms(): Promise<TermResponseDto[]> {
    try {
      return await this.termService.getAllTerms();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('active')
  @ApiOperation({ summary: 'Récupérer le trimestre actif' })
  @ApiResponse({
    status: 200,
    description: 'Trimestre actif',
    type: TermResponseDto,
  })
  async getActiveTerm(): Promise<TermResponseDto> {
    try {
      return await this.termService.getActiveTerm();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  @Get('school-year/:schoolYearId')
  @ApiOperation({ summary: 'Récupérer les trimestres d\'une année scolaire' })
  @ApiParam({ name: 'schoolYearId', description: 'ID de l\'année scolaire' })
  @ApiResponse({
    status: 200,
    description: 'Liste des trimestres de l\'année scolaire',
    type: [TermResponseDto],
  })
  async getTermsBySchoolYear(
    @Param('schoolYearId') schoolYearId: string,
  ): Promise<TermResponseDto[]> {
    try {
      return await this.termService.getTermsBySchoolYear(schoolYearId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un trimestre par ID' })
  @ApiParam({ name: 'id', description: 'ID du trimestre' })
  @ApiResponse({
    status: 200,
    description: 'Trimestre trouvé',
    type: TermResponseDto,
  })
  async getTermById(@Param('id') id: string): Promise<TermResponseDto> {
    try {
      return await this.termService.getTermById(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un trimestre' })
  @ApiParam({ name: 'id', description: 'ID du trimestre' })
  @ApiBody({ type: UpdateTermDto })
  @ApiResponse({
    status: 200,
    description: 'Trimestre mis à jour avec succès',
    type: TermResponseDto,
  })
  async updateTerm(
    @Param('id') id: string,
    @Body() updateTermDto: UpdateTermDto,
  ): Promise<TermResponseDto> {
    try {
      return await this.termService.updateTerm(id, updateTermDto);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un trimestre' })
  @ApiParam({ name: 'id', description: 'ID du trimestre' })
  @ApiResponse({
    status: 200,
    description: 'Trimestre supprimé avec succès',
  })
  async deleteTerm(@Param('id') id: string): Promise<void> {
    try {
      await this.termService.deleteTerm(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activer un trimestre' })
  @ApiParam({ name: 'id', description: 'ID du trimestre' })
  @ApiResponse({
    status: 200,
    description: 'Trimestre activé avec succès',
    type: TermResponseDto,
  })
  async setActiveTerm(@Param('id') id: string): Promise<TermResponseDto> {
    try {
      return await this.termService.setActiveTerm(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
