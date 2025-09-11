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
import { AssessmentResultService } from './assessment-result.service';
import {
  CreateAssessmentResultDto,
  UpdateAssessmentResultDto,
  AssessmentResultResponseDto,
  BulkCreateAssessmentResultDto,
} from './dto/assessment-result.dto';

@ApiTags('Assessment Results')
@Controller('assessment-results')
export class AssessmentResultController {
  constructor(
    private readonly assessmentResultService: AssessmentResultService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer un nouveau résultat d'évaluation" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Résultat créé avec succès',
    type: AssessmentResultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou note supérieure au maximum',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation ou étudiant non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Un résultat existe déjà pour cet étudiant et cette évaluation',
  })
  async create(
    @Body() createAssessmentResultDto: CreateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto> {
    return this.assessmentResultService.create(createAssessmentResultDto);
  }

  @Post('bulk')
  @ApiOperation({
    summary: "Créer plusieurs résultats d'évaluation en une fois",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Résultats créés avec succès',
    type: [AssessmentResultResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async bulkCreate(
    @Body() bulkCreateDto: BulkCreateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto[]> {
    return this.assessmentResultService.bulkCreate(bulkCreateDto);
  }

  @Get()
  @ApiOperation({ summary: "Récupérer tous les résultats d'évaluation" })
  @ApiQuery({
    name: 'assessmentId',
    required: false,
    description: "Filtrer par ID de l'évaluation",
  })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: "Filtrer par ID de l'étudiant",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des résultats récupérée avec succès',
    type: [AssessmentResultResponseDto],
  })
  async findAll(
    @Query('assessmentId') assessmentId?: string,
    @Query('studentId') studentId?: string,
  ): Promise<AssessmentResultResponseDto[]> {
    if (assessmentId) {
      return this.assessmentResultService.findByAssessment(assessmentId);
    }
    if (studentId) {
      return this.assessmentResultService.findByStudent(studentId);
    }
    return this.assessmentResultService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un résultat par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID du résultat',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Résultat récupéré avec succès',
    type: AssessmentResultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Résultat non trouvé',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AssessmentResultResponseDto> {
    return this.assessmentResultService.findOne(id);
  }

  @Get('assessment/:assessmentId')
  @ApiOperation({ summary: "Récupérer les résultats d'une évaluation" })
  @ApiParam({
    name: 'assessmentId',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Résultats de l'évaluation récupérés avec succès",
    type: [AssessmentResultResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async findByAssessment(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<AssessmentResultResponseDto[]> {
    return this.assessmentResultService.findByAssessment(assessmentId);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: "Récupérer les résultats d'un étudiant" })
  @ApiParam({
    name: 'studentId',
    description: "ID de l'étudiant",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Résultats de l'étudiant récupérés avec succès",
    type: [AssessmentResultResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Étudiant non trouvé',
  })
  async findByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ): Promise<AssessmentResultResponseDto[]> {
    return this.assessmentResultService.findByStudent(studentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Mettre à jour un résultat d'évaluation" })
  @ApiParam({
    name: 'id',
    description: 'ID du résultat',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Résultat mis à jour avec succès',
    type: AssessmentResultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Résultat non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAssessmentResultDto: UpdateAssessmentResultDto,
  ): Promise<AssessmentResultResponseDto> {
    return this.assessmentResultService.update(id, updateAssessmentResultDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Supprimer un résultat d'évaluation" })
  @ApiParam({
    name: 'id',
    description: 'ID du résultat',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Résultat supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Résultat non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.assessmentResultService.remove(id);
  }
}
