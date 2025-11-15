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
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import {
  CreateEventDto,
  UpdateEventDto,
  EventResponseDto,
  EventCalendarDto,
} from './dto/event.dto';
import { EventType } from '../../entities/event.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel événement' })
  @ApiResponse({
    status: 201,
    description: 'Événement créé avec succès',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur, classe ou année scolaire non trouvé(e)',
  })
  async create(@Body() createEventDto: CreateEventDto) {
    return await this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les événements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des événements',
    type: [EventResponseDto],
  })
  async findAll() {
    return await this.eventService.findAll();
  }

  @Get('class/:classId')
  @ApiOperation({ summary: "Récupérer les événements d'une classe" })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiResponse({
    status: 200,
    description: 'Événements de la classe',
    type: [EventResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Classe non trouvée',
  })
  async findByClass(
    @Param('classId', ParseUUIDPipe) classId: string,
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
  ) {
    return await this.eventService.findByClass(classId, academicYearId);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Récupérer les événements dans une plage de dates' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Date de début (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'Date de fin (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'academicYearId',
    required: false,
    description: "ID de l'année scolaire",
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'ID de la classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements dans la plage de dates',
    type: [EventResponseDto],
  })
  async findByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('academicYearId') academicYearId?: string,
    @Query('classId') classId?: string,
  ) {
    return await this.eventService.findByDateRange(
      startDate,
      endDate,
      academicYearId,
      classId,
    );
  }

  @Get('type/:eventType')
  @ApiOperation({ summary: 'Récupérer les événements par type' })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'ID de la classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements du type spécifié',
    type: [EventResponseDto],
  })
  async findByType(
    @Param('eventType') eventType: EventType,
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
    @Query('classId') classId?: string,
  ) {
    return await this.eventService.findByType(
      eventType,
      academicYearId,
      classId,
    );
  }

  @Get('calendar/:year/:month')
  @ApiOperation({
    summary: 'Récupérer les événements pour un calendrier mensuel',
  })
  @ApiQuery({
    name: 'academicYearId',
    required: false,
    description: "ID de l'année scolaire",
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'ID de la classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements du calendrier mensuel',
    type: [EventCalendarDto],
  })
  async getCalendarEvents(
    @Param('year', ParseIntPipe) year: number,
    @Param('month', ParseIntPipe) month: number,
    @Query('academicYearId') academicYearId?: string,
    @Query('classId') classId?: string,
  ) {
    return await this.eventService.getCalendarEvents(
      year,
      month,
      academicYearId,
      classId,
    );
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Récupérer les événements à venir' })
  @ApiQuery({
    name: 'academicYearId',
    required: true,
    description: "ID de l'année scolaire",
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: "Nombre d'événements à retourner",
  })
  @ApiQuery({
    name: 'classId',
    required: false,
    description: 'ID de la classe',
  })
  @ApiResponse({
    status: 200,
    description: 'Événements à venir',
    type: [EventResponseDto],
  })
  async getUpcomingEvents(
    @Query('academicYearId', ParseUUIDPipe) academicYearId: string,
    @Query('limit', ParseIntPipe) limit?: number,
    @Query('classId') classId?: string,
  ) {
    return await this.eventService.getUpcomingEvents(
      academicYearId,
      limit || 10,
      classId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un événement par ID' })
  @ApiResponse({
    status: 200,
    description: 'Événement trouvé',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.eventService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un événement' })
  @ApiResponse({
    status: 200,
    description: 'Événement mis à jour avec succès',
    type: EventResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return await this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un événement' })
  @ApiResponse({
    status: 200,
    description: 'Événement supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.eventService.remove(id);
    return { message: 'Événement supprimé avec succès' };
  }
}
