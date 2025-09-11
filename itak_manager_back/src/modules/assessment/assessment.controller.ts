import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AssessmentService } from './assessment.service';
import {
  CreateAssessmentDto,
  UpdateAssessmentDto,
  AssessmentResponseDto,
} from './dto/assessment.dto';

@ApiTags('Assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle évaluation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Évaluation créée avec succès',
    type: AssessmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou trimestre inactif',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trimestre ou matière de classe non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Une évaluation avec le même titre existe déjà',
  })
  async create(
    @Body() createAssessmentDto: CreateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentService.create(createAssessmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les évaluations' })
  @ApiQuery({
    name: 'termId',
    required: false,
    description: 'Filtrer par ID du trimestre',
  })
  @ApiQuery({
    name: 'classSubjectId',
    required: false,
    description: 'Filtrer par ID de la matière de classe',
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'Filtrer par ID de la classe',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des évaluations récupérée avec succès',
    type: [AssessmentResponseDto],
  })
  async findAll(
    @Query('termId') termId?: string,
    @Query('classSubjectId') classSubjectId?: string,
    @Query('classId') classId?: string,
  ): Promise<AssessmentResponseDto[]> {
    if (termId) {
      return this.assessmentService.findByTerm(termId);
    }
    if (classSubjectId) {
      return this.assessmentService.findByClassSubject(classSubjectId);
    }
    if (classId) {
      return this.assessmentService.findByClass(classId);
    }
    return this.assessmentService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une évaluation par son ID' })
  @ApiParam({
    name: 'id',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Évaluation récupérée avec succès',
    type: AssessmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentService.findOne(id);
  }

  @Get('term/:termId')
  @ApiOperation({ summary: "Récupérer les évaluations d'un trimestre" })
  @ApiParam({
    name: 'termId',
    description: 'ID du trimestre',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Évaluations du trimestre récupérées avec succès',
    type: [AssessmentResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Trimestre non trouvé',
  })
  async findByTerm(
    @Param('termId', ParseUUIDPipe) termId: string,
  ): Promise<AssessmentResponseDto[]> {
    return this.assessmentService.findByTerm(termId);
  }

  @Get('class-subject/:classSubjectId')
  @ApiOperation({
    summary: "Récupérer les évaluations d'une matière de classe",
  })
  @ApiParam({
    name: 'classSubjectId',
    description: 'ID de la matière de classe',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Évaluations de la matière récupérées avec succès',
    type: [AssessmentResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Matière de classe non trouvée',
  })
  async findByClassSubject(
    @Param('classSubjectId', ParseUUIDPipe) classSubjectId: string,
  ): Promise<AssessmentResponseDto[]> {
    return this.assessmentService.findByClassSubject(classSubjectId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: "Récupérer les évaluations d'une classe" })
  @ApiParam({
    name: 'classId',
    description: 'ID de la classe',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Évaluations de la classe récupérées avec succès',
    type: [AssessmentResponseDto],
  })
  async findByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
  ): Promise<AssessmentResponseDto[]> {
    return this.assessmentService.findByClass(classId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une évaluation' })
  @ApiParam({
    name: 'id',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Évaluation mise à jour avec succès',
    type: AssessmentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Une évaluation avec le même titre existe déjà',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<AssessmentResponseDto> {
    return this.assessmentService.update(id, updateAssessmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une évaluation' })
  @ApiParam({
    name: 'id',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Évaluation supprimée avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.assessmentService.remove(id);
  }
}
