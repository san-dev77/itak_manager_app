import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TeachingAssignmentService } from './teaching-assignment.service';
import {
  CreateTeachingAssignmentDto,
  UpdateTeachingAssignmentDto,
  TeachingAssignmentResponseDto,
} from './dto/teaching-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('teaching-assignments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teaching-assignments')
export class TeachingAssignmentController {
  constructor(
    private readonly teachingAssignmentService: TeachingAssignmentService,
  ) {}

  @Post()
  @ApiOperation({ summary: "Créer une nouvelle affectation d'enseignement" })
  @ApiResponse({
    status: 201,
    description: 'Affectation créée avec succès',
    type: TeachingAssignmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Professeur ou association classe-matière non trouvé(e)',
  })
  @ApiResponse({
    status: 409,
    description: 'Ce professeur est déjà affecté à cette classe-matière',
  })
  async create(
    @Body() createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ) {
    return await this.teachingAssignmentService.createTeachingAssignment(
      createTeachingAssignmentDto,
    );
  }

  @Get()
  @ApiOperation({ summary: "Récupérer toutes les affectations d'enseignement" })
  @ApiResponse({
    status: 200,
    description: 'Liste des affectations',
    type: [TeachingAssignmentResponseDto],
  })
  async findAll() {
    return await this.teachingAssignmentService.getAllTeachingAssignments();
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: "Récupérer les affectations d'un professeur" })
  @ApiResponse({
    status: 200,
    description: 'Affectations du professeur',
    type: [TeachingAssignmentResponseDto],
  })
  async findByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
    return await this.teachingAssignmentService.getTeachingAssignmentsByTeacher(
      teacherId,
    );
  }

  @Get('class-subject/:classSubjectId')
  @ApiOperation({
    summary: 'Récupérer les affectations pour une association classe-matière',
  })
  @ApiResponse({
    status: 200,
    description: 'Affectations pour la classe-matière',
    type: [TeachingAssignmentResponseDto],
  })
  async findByClassSubject(
    @Param('classSubjectId', ParseUUIDPipe) classSubjectId: string,
  ) {
    return await this.teachingAssignmentService.getTeachingAssignmentsByClassSubject(
      classSubjectId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une affectation par ID' })
  @ApiResponse({
    status: 200,
    description: 'Affectation trouvée',
    type: TeachingAssignmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Affectation non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.teachingAssignmentService.getTeachingAssignmentById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: "Mettre à jour une affectation d'enseignement" })
  @ApiResponse({
    status: 200,
    description: 'Affectation mise à jour avec succès',
    type: TeachingAssignmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Affectation non trouvée',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflit : cette affectation existe déjà',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ) {
    return await this.teachingAssignmentService.updateTeachingAssignment(
      id,
      updateTeachingAssignmentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: "Supprimer une affectation d'enseignement" })
  @ApiResponse({
    status: 200,
    description: 'Affectation supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Affectation non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.teachingAssignmentService.deleteTeachingAssignment(id);
  }
}
