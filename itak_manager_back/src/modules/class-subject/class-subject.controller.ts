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
import { ClassSubjectService } from './class-subject.service';
import {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
  ClassSubjectResponseDto,
} from './dto/class-subject.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('class-subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('class-subjects')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Créer une nouvelle association classe-matière' })
  @ApiResponse({
    status: 201,
    description: 'Association créée avec succès',
    type: ClassSubjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Classe ou matière non trouvée',
  })
  @ApiResponse({
    status: 409,
    description: 'Cette association existe déjà',
  })
  async create(@Body() createClassSubjectDto: CreateClassSubjectDto) {
    return await this.classSubjectService.createClassSubject(
      createClassSubjectDto,
    );
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les associations classe-matière' })
  @ApiResponse({
    status: 200,
    description: 'Liste des associations',
    type: [ClassSubjectResponseDto],
  })
  async findAll() {
    return await this.classSubjectService.getAllClassSubjects();
  }

  @Get('class/:classId')
  @Public()
  @ApiOperation({ summary: "Récupérer les matières d'une classe" })
  @ApiResponse({
    status: 200,
    description: 'Matières de la classe',
    type: [ClassSubjectResponseDto],
  })
  async findByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return await this.classSubjectService.getClassSubjectsByClass(classId);
  }

  @Get('subject/:subjectId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les classes pour une matière' })
  @ApiResponse({
    status: 200,
    description: 'Classes enseignant cette matière',
    type: [ClassSubjectResponseDto],
  })
  async findBySubject(@Param('subjectId', ParseUUIDPipe) subjectId: string) {
    return await this.classSubjectService.getClassSubjectsBySubject(subjectId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une association par ID' })
  @ApiResponse({
    status: 200,
    description: 'Association trouvée',
    type: ClassSubjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.classSubjectService.getClassSubjectById(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Mettre à jour une association classe-matière' })
  @ApiResponse({
    status: 200,
    description: 'Association mise à jour avec succès',
    type: ClassSubjectResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClassSubjectDto: UpdateClassSubjectDto,
  ) {
    return await this.classSubjectService.updateClassSubject(
      id,
      updateClassSubjectDto,
    );
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Supprimer une association classe-matière' })
  @ApiResponse({
    status: 200,
    description: 'Association supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Association non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.classSubjectService.deleteClassSubject(id);
  }
}
