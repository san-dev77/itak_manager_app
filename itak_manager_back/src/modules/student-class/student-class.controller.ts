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
import { StudentClassService } from './student-class.service';
import {
  CreateStudentClassDto,
  UpdateStudentClassDto,
  StudentClassResponseDto,
} from './dto/student-class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('student-classes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-classes')
export class StudentClassController {
  constructor(private readonly studentClassService: StudentClassService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle inscription étudiant-classe' })
  @ApiResponse({
    status: 201,
    description: 'Inscription créée avec succès',
    type: StudentClassResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant ou classe non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Cette inscription existe déjà',
  })
  async create(@Body() createStudentClassDto: CreateStudentClassDto) {
    return await this.studentClassService.createStudentClass(
      createStudentClassDto,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Récupérer toutes les inscriptions étudiant-classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des inscriptions',
    type: [StudentClassResponseDto],
  })
  async findAll() {
    return await this.studentClassService.getAllStudentClasses();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: "Récupérer les classes d'un étudiant" })
  @ApiResponse({
    status: 200,
    description: "Classes de l'étudiant",
    type: [StudentClassResponseDto],
  })
  async findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentClassService.getStudentClassesByStudent(studentId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: "Récupérer les étudiants d'une classe" })
  @ApiResponse({
    status: 200,
    description: 'Étudiants de la classe',
    type: [StudentClassResponseDto],
  })
  async findByClass(@Param('classId', ParseUUIDPipe) classId: string) {
    return await this.studentClassService.getStudentClassesByClass(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une inscription par ID' })
  @ApiResponse({
    status: 200,
    description: 'Inscription trouvée',
    type: StudentClassResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Inscription non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentClassService.getStudentClassById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une inscription étudiant-classe' })
  @ApiResponse({
    status: 200,
    description: 'Inscription mise à jour avec succès',
    type: StudentClassResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Inscription non trouvée',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentClassDto: UpdateStudentClassDto,
  ) {
    return await this.studentClassService.updateStudentClass(
      id,
      updateStudentClassDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une inscription étudiant-classe' })
  @ApiResponse({
    status: 200,
    description: 'Inscription supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Inscription non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentClassService.deleteStudentClass(id);
  }
}

