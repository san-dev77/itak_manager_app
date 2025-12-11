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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { GradeComplaintService } from './grade-complaint.service';
import {
  CreateGradeComplaintDto,
  UpdateGradeComplaintStatusDto,
  GradeComplaintResponseDto,
  GradeComplaintHistoryResponseDto,
} from './dto/grade-complaint.dto';

@ApiTags('Grade Complaints')
@Controller('grade-complaints')
@ApiBearerAuth()
export class GradeComplaintController {
  constructor(private readonly gradeComplaintService: GradeComplaintService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réclamation de note' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Réclamation créée avec succès',
    type: GradeComplaintResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou aucun résultat trouvé',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Étudiant ou évaluation non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description:
      'Une réclamation existe déjà pour cet étudiant et cette évaluation',
  })
  async create(
    @Body() createGradeComplaintDto: CreateGradeComplaintDto,
  ): Promise<GradeComplaintResponseDto> {
    return this.gradeComplaintService.create(createGradeComplaintDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les réclamations de notes' })
  @ApiQuery({
    name: 'studentId',
    required: false,
    description: "Filtrer par ID de l'étudiant",
  })
  @ApiQuery({
    name: 'assessmentId',
    required: false,
    description: "Filtrer par ID de l'évaluation",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des réclamations récupérée avec succès',
    type: [GradeComplaintResponseDto],
  })
  async findAll(
    @Query('studentId') studentId?: string,
    @Query('assessmentId') assessmentId?: string,
  ): Promise<GradeComplaintResponseDto[]> {
    if (studentId) {
      return this.gradeComplaintService.findByStudent(studentId);
    }
    if (assessmentId) {
      return this.gradeComplaintService.findByAssessment(assessmentId);
    }
    return this.gradeComplaintService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une réclamation par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la réclamation',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Réclamation récupérée avec succès',
    type: GradeComplaintResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Réclamation non trouvée',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GradeComplaintResponseDto> {
    return this.gradeComplaintService.findOne(id);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: "Récupérer les réclamations d'un étudiant" })
  @ApiParam({
    name: 'studentId',
    description: "ID de l'étudiant",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Réclamations de l'étudiant récupérées avec succès",
    type: [GradeComplaintResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Étudiant non trouvé',
  })
  async findByStudent(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ): Promise<GradeComplaintResponseDto[]> {
    return this.gradeComplaintService.findByStudent(studentId);
  }

  @Get('assessment/:assessmentId')
  @ApiOperation({ summary: "Récupérer les réclamations d'une évaluation" })
  @ApiParam({
    name: 'assessmentId',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Réclamations de l'évaluation récupérées avec succès",
    type: [GradeComplaintResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async findByAssessment(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<GradeComplaintResponseDto[]> {
    return this.gradeComplaintService.findByAssessment(assessmentId);
  }

  @Get(':id/history')
  @ApiOperation({ summary: "Récupérer l'historique d'une réclamation" })
  @ApiParam({
    name: 'id',
    description: 'ID de la réclamation',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historique récupéré avec succès',
    type: [GradeComplaintHistoryResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Réclamation non trouvée',
  })
  async getHistory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GradeComplaintHistoryResponseDto[]> {
    return this.gradeComplaintService.getHistory(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: "Mettre à jour le statut d'une réclamation" })
  @ApiParam({
    name: 'id',
    description: 'ID de la réclamation',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Statut mis à jour avec succès',
    type: GradeComplaintResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou réclamation déjà traitée',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Réclamation non trouvée',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateGradeComplaintStatusDto,
    @Request() req: any,
  ): Promise<GradeComplaintResponseDto> {
    // Extract user ID from request (assuming JWT auth)
    const changedByUserId = req.user?.id || req.user?.sub;
    return this.gradeComplaintService.updateStatus(
      id,
      updateStatusDto,
      changedByUserId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une réclamation' })
  @ApiParam({
    name: 'id',
    description: 'ID de la réclamation',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Réclamation supprimée avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Réclamation non trouvée',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Les réclamations traitées ne peuvent pas être supprimées',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.gradeComplaintService.remove(id);
  }
}
