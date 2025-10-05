import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EventParticipant,
  ParticipantStatus,
} from '../../entities/event-participant.entity';
import { Event } from '../../entities/event.entity';
import { User } from '../../entities/user.entity';
import {
  CreateEventParticipantDto,
  UpdateEventParticipantDto,
  BulkInviteParticipantsDto,
  UpdateParticipantStatusDto,
} from './dto/event-participant.dto';

@Injectable()
export class EventParticipantService {
  constructor(
    @InjectRepository(EventParticipant)
    private readonly eventParticipantRepository: Repository<EventParticipant>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createEventParticipantDto: CreateEventParticipantDto,
  ): Promise<EventParticipant> {
    // Vérifier que l'événement existe
    const event = await this.eventRepository.findOne({
      where: { id: createEventParticipantDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Événement avec l'ID ${createEventParticipantDto.eventId} non trouvé`,
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await this.userRepository.findOne({
      where: { id: createEventParticipantDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createEventParticipantDto.userId} non trouvé`,
      );
    }

    // Vérifier que le participant n'existe pas déjà
    const existingParticipant = await this.eventParticipantRepository.findOne({
      where: {
        eventId: createEventParticipantDto.eventId,
        userId: createEventParticipantDto.userId,
      },
    });
    if (existingParticipant) {
      throw new ConflictException(
        `L'utilisateur ${user.firstName} ${user.lastName} participe déjà à cet événement`,
      );
    }

    const participant = this.eventParticipantRepository.create({
      ...createEventParticipantDto,
      status: createEventParticipantDto.status || ParticipantStatus.INVITED,
    });

    return await this.eventParticipantRepository.save(participant);
  }

  async bulkInvite(
    bulkInviteDto: BulkInviteParticipantsDto,
  ): Promise<EventParticipant[]> {
    // Vérifier que l'événement existe
    const event = await this.eventRepository.findOne({
      where: { id: bulkInviteDto.eventId },
    });
    if (!event) {
      throw new NotFoundException(
        `Événement avec l'ID ${bulkInviteDto.eventId} non trouvé`,
      );
    }

    const participants: EventParticipant[] = [];

    for (const participantData of bulkInviteDto.participants) {
      // Vérifier que l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: { id: participantData.userId },
      });
      if (!user) {
        continue; // Ignorer les utilisateurs inexistants
      }

      // Vérifier que le participant n'existe pas déjà
      const existingParticipant = await this.eventParticipantRepository.findOne(
        {
          where: {
            eventId: bulkInviteDto.eventId,
            userId: participantData.userId,
          },
        },
      );
      if (existingParticipant) {
        continue; // Ignorer les participants déjà existants
      }

      const participant = this.eventParticipantRepository.create({
        eventId: bulkInviteDto.eventId,
        userId: participantData.userId,
        role: participantData.role,
        status: ParticipantStatus.INVITED,
      });

      participants.push(
        await this.eventParticipantRepository.save(participant),
      );
    }

    return participants;
  }

  async findAll(): Promise<EventParticipant[]> {
    return await this.eventParticipantRepository.find({
      relations: ['event', 'user'],
      order: { event: { startDate: 'DESC' } },
    });
  }

  async findOne(id: string): Promise<EventParticipant> {
    const participant = await this.eventParticipantRepository.findOne({
      where: { id },
      relations: ['event', 'user'],
    });

    if (!participant) {
      throw new NotFoundException(`Participant avec l'ID ${id} non trouvé`);
    }

    return participant;
  }

  async findByEvent(eventId: string): Promise<EventParticipant[]> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${eventId} non trouvé`);
    }

    return await this.eventParticipantRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { role: 'ASC', user: { lastName: 'ASC' } },
    });
  }

  async findByUser(userId: string): Promise<EventParticipant[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    return await this.eventParticipantRepository.find({
      where: { userId },
      relations: ['event'],
      order: { event: { startDate: 'DESC' } },
    });
  }

  async findByStatus(
    eventId: string,
    status: ParticipantStatus,
  ): Promise<EventParticipant[]> {
    return await this.eventParticipantRepository.find({
      where: { eventId, status },
      relations: ['user'],
      order: { user: { lastName: 'ASC' } },
    });
  }

  async updateStatus(
    id: string,
    updateStatusDto: UpdateParticipantStatusDto,
  ): Promise<EventParticipant> {
    const participant = await this.findOne(id);
    participant.status = updateStatusDto.status;
    return await this.eventParticipantRepository.save(participant);
  }

  async update(
    id: string,
    updateEventParticipantDto: UpdateEventParticipantDto,
  ): Promise<EventParticipant> {
    const participant = await this.findOne(id);

    Object.assign(participant, updateEventParticipantDto);
    return await this.eventParticipantRepository.save(participant);
  }

  async remove(id: string): Promise<void> {
    const participant = await this.findOne(id);
    await this.eventParticipantRepository.remove(participant);
  }

  async removeByEventAndUser(eventId: string, userId: string): Promise<void> {
    const participant = await this.eventParticipantRepository.findOne({
      where: { eventId, userId },
    });

    if (!participant) {
      throw new NotFoundException(
        `Participant non trouvé pour l'événement ${eventId} et l'utilisateur ${userId}`,
      );
    }

    await this.eventParticipantRepository.remove(participant);
  }

  async getEventStatistics(eventId: string): Promise<{
    total: number;
    invited: number;
    confirmed: number;
    declined: number;
    absent: number;
  }> {
    const participants = await this.findByEvent(eventId);

    return {
      total: participants.length,
      invited: participants.filter(
        (p) => p.status === ParticipantStatus.INVITED,
      ).length,
      confirmed: participants.filter(
        (p) => p.status === ParticipantStatus.CONFIRMED,
      ).length,
      declined: participants.filter(
        (p) => p.status === ParticipantStatus.DECLINED,
      ).length,
      absent: participants.filter((p) => p.status === ParticipantStatus.ABSENT)
        .length,
    };
  }
}
