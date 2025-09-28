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
import { EventParticipantService } from './event-participant.service';
import {
  CreateEventParticipantDto,
  UpdateEventParticipantDto,
  EventParticipantResponseDto,
  BulkInviteParticipantsDto,
  UpdateParticipantStatusDto,
} from './dto/event-participant.dto';
import { ParticipantStatus } from '../../entities/event-participant.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('event-participants')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('event-participants')
export class EventParticipantController {
  constructor(
    private readonly eventParticipantService: EventParticipantService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter un participant à un événement' })
  @ApiResponse({
    status: 201,
    description: 'Participant ajouté avec succès',
    type: EventParticipantResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Événement ou utilisateur non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Le participant existe déjà pour cet événement',
  })
  async create(@Body() createEventParticipantDto: CreateEventParticipantDto) {
    return await this.eventParticipantService.create(createEventParticipantDto);
  }

  @Post('bulk-invite')
  @ApiOperation({ summary: 'Inviter plusieurs participants à un événement' })
  @ApiResponse({
    status: 201,
    description: 'Participants invités avec succès',
    type: [EventParticipantResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async bulkInvite(@Body() bulkInviteDto: BulkInviteParticipantsDto) {
    return await this.eventParticipantService.bulkInvite(bulkInviteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les participants aux événements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des participants',
    type: [EventParticipantResponseDto],
  })
  async findAll() {
    return await this.eventParticipantService.findAll();
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: "Récupérer les participants d'un événement" })
  @ApiResponse({
    status: 200,
    description: "Participants de l'événement",
    type: [EventParticipantResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Événement non trouvé',
  })
  async findByEvent(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return await this.eventParticipantService.findByEvent(eventId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: "Récupérer les événements d'un utilisateur" })
  @ApiResponse({
    status: 200,
    description: "Événements de l'utilisateur",
    type: [EventParticipantResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.eventParticipantService.findByUser(userId);
  }

  @Get('event/:eventId/status/:status')
  @ApiOperation({
    summary: 'Récupérer les participants par statut pour un événement',
  })
  @ApiResponse({
    status: 200,
    description: 'Participants avec le statut spécifié',
    type: [EventParticipantResponseDto],
  })
  async findByStatus(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('status') status: ParticipantStatus,
  ) {
    return await this.eventParticipantService.findByStatus(eventId, status);
  }

  @Get('event/:eventId/statistics')
  @ApiOperation({
    summary: "Récupérer les statistiques de participation d'un événement",
  })
  @ApiResponse({
    status: 200,
    description: 'Statistiques de participation',
  })
  async getEventStatistics(@Param('eventId', ParseUUIDPipe) eventId: string) {
    return await this.eventParticipantService.getEventStatistics(eventId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un participant par ID' })
  @ApiResponse({
    status: 200,
    description: 'Participant trouvé',
    type: EventParticipantResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participant non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.eventParticipantService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: "Mettre à jour le statut d'un participant" })
  @ApiResponse({
    status: 200,
    description: 'Statut mis à jour avec succès',
    type: EventParticipantResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participant non trouvé',
  })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStatusDto: UpdateParticipantStatusDto,
  ) {
    return await this.eventParticipantService.updateStatus(id, updateStatusDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un participant' })
  @ApiResponse({
    status: 200,
    description: 'Participant mis à jour avec succès',
    type: EventParticipantResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Participant non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventParticipantDto: UpdateEventParticipantDto,
  ) {
    return await this.eventParticipantService.update(
      id,
      updateEventParticipantDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un participant' })
  @ApiResponse({
    status: 200,
    description: 'Participant supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Participant non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.eventParticipantService.remove(id);
    return { message: 'Participant supprimé avec succès' };
  }

  @Delete('event/:eventId/user/:userId')
  @ApiOperation({ summary: "Retirer un utilisateur d'un événement" })
  @ApiResponse({
    status: 200,
    description: "Utilisateur retiré de l'événement avec succès",
  })
  @ApiResponse({
    status: 404,
    description: 'Participant non trouvé',
  })
  async removeByEventAndUser(
    @Param('eventId', ParseUUIDPipe) eventId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.eventParticipantService.removeByEventAndUser(eventId, userId);
    return { message: "Utilisateur retiré de l'événement avec succès" };
  }
}
