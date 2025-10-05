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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ParentService } from './parent.service';
import {
  CreateParentDto,
  UpdateParentDto,
  ParentResponseDto,
  CreateStudentParentDto,
  StudentParentResponseDto,
} from './dto/parent.dto';

@ApiTags('parents')
@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un parent' })
  @ApiResponse({ status: 201, description: 'Parent créé avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 409, description: 'Utilisateur déjà parent' })
  async createParent(
    @Body(ValidationPipe) createParentDto: CreateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentService.createParent(createParentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les parents' })
  @ApiResponse({ status: 200, description: 'Liste des parents' })
  async getAllParents(): Promise<ParentResponseDto[]> {
    return this.parentService.getAllParents();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un parent par ID' })
  @ApiResponse({ status: 200, description: 'Parent trouvé' })
  @ApiResponse({ status: 404, description: 'Parent non trouvé' })
  async getParentById(@Param('id') id: string): Promise<ParentResponseDto> {
    return this.parentService.getParentById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un parent' })
  @ApiResponse({ status: 200, description: 'Parent mis à jour' })
  @ApiResponse({ status: 404, description: 'Parent non trouvé' })
  async updateParent(
    @Param('id') id: string,
    @Body(ValidationPipe) updateParentDto: UpdateParentDto,
  ): Promise<ParentResponseDto> {
    return this.parentService.updateParent(id, updateParentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un parent' })
  @ApiResponse({ status: 204, description: 'Parent supprimé' })
  @ApiResponse({ status: 404, description: 'Parent non trouvé' })
  async deleteParent(@Param('id') id: string): Promise<void> {
    return this.parentService.deleteParent(id);
  }

  @Post('link-student')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Lier un étudiant à un parent' })
  @ApiResponse({ status: 201, description: 'Relation créée avec succès' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 404, description: 'Étudiant ou parent non trouvé' })
  @ApiResponse({ status: 409, description: 'Relation déjà existante' })
  async linkStudentToParent(
    @Body(ValidationPipe) createStudentParentDto: CreateStudentParentDto,
  ): Promise<StudentParentResponseDto> {
    return this.parentService.linkStudentToParent(createStudentParentDto);
  }

  @Get('student/:studentId/parents')
  @ApiOperation({ summary: "Récupérer les parents d'un étudiant" })
  @ApiResponse({ status: 200, description: "Liste des parents de l'étudiant" })
  async getStudentParents(
    @Param('studentId') studentId: string,
  ): Promise<StudentParentResponseDto[]> {
    return this.parentService.getStudentParents(studentId);
  }
}
