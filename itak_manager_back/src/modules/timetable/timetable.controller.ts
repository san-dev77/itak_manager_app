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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { TimetableService } from './timetable.service';
import {
  CreateTimetableDto,
  UpdateTimetableDto,
  TimetableResponseDto,
  WeeklyTimetableDto,
} from './dto/timetable.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('timetables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('timetables')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel emploi du temps' })
  @ApiResponse({
    status: 201,
    description: 'Emploi du temps créé avec succès',
    type: TimetableResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Données invalides ou conflit d'horaire",
  })
  @ApiResponse({
    status: 404,
    description: 'Classe, enseignant, matière ou année scolaire non trouvé(e)',
  })
  @ApiResponse({
    status: 409,
    description: "Conflit d'horaire détecté",
  })
  async create(@Body() createTimetableDto: CreateTimetableDto) {
    return await this.timetableService.create(createTimetableDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les emplois du temps' })
  @ApiResponse({
    status: 200,
    description: 'Liste des emplois du temps',
    type: [TimetableResponseDto],
  })
  async findAll() {
    return await this.timetableService.findAll();
  }

  @Get('class/:classId')
  @ApiOperation({ summary: "Récupérer l'emploi du temps d'une classe" })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiResponse({
    status: 200,
    description: 'Emploi du temps de la classe',
    type: [TimetableResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Classe non trouvée',
  })
  async findByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
  ) {
    return await this.timetableService.findByClass(classId, academicYearId);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: "Récupérer l'emploi du temps d'un enseignant" })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiResponse({
    status: 200,
    description: "Emploi du temps de l'enseignant",
    type: [TimetableResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Enseignant non trouvé',
  })
  async findByTeacher(
    @Param('teacherId', ParseUUIDPipe) teacherId: string,
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
  ) {
    return await this.timetableService.findByTeacher(teacherId, academicYearId);
  }

  @Get('weekly/:classId')
  @ApiOperation({
    summary: "Récupérer l'emploi du temps hebdomadaire d'une classe",
  })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiResponse({
    status: 200,
    description: 'Emploi du temps hebdomadaire de la classe',
    type: WeeklyTimetableDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Classe non trouvée',
  })
  async getWeeklyTimetable(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
  ) {
    return await this.timetableService.getWeeklyTimetable(
      classId,
      academicYearId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un emploi du temps par ID' })
  @ApiResponse({
    status: 200,
    description: 'Emploi du temps trouvé',
    type: TimetableResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Emploi du temps non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.timetableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un emploi du temps' })
  @ApiResponse({
    status: 200,
    description: 'Emploi du temps mis à jour avec succès',
    type: TimetableResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Emploi du temps non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTimetableDto: UpdateTimetableDto,
  ) {
    return await this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un emploi du temps' })
  @ApiResponse({
    status: 200,
    description: 'Emploi du temps supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Emploi du temps non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.timetableService.remove(id);
    return { message: 'Emploi du temps supprimé avec succès' };
  }
}
