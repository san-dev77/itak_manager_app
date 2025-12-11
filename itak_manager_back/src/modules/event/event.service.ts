import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event, EventType } from '../../entities/event.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import {
  CreateEventDto,
  UpdateEventDto,
  EventCalendarDto,
} from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SchoolYear)
    private readonly schoolYearRepository: Repository<SchoolYear>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Vérifier que le créateur existe
    const creator = await this.userRepository.findOne({
      where: { id: createEventDto.createdBy },
    });
    if (!creator) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createEventDto.createdBy} non trouvé`,
      );
    }

    // Vérifier que l'année scolaire existe
    const academicYear = await this.schoolYearRepository.findOne({
      where: { id: createEventDto.academicYearId },
    });
    if (!academicYear) {
      throw new NotFoundException(
        `Année scolaire avec l'ID ${createEventDto.academicYearId} non trouvée`,
      );
    }

    // Si une classe est spécifiée, vérifier qu'elle existe
    if (createEventDto.classId) {
      const classEntity = await this.classRepository.findOne({
        where: { id: createEventDto.classId },
      });
      if (!classEntity) {
        throw new NotFoundException(
          `Classe avec l'ID ${createEventDto.classId} non trouvée`,
        );
      }
    }

    // Vérifier la cohérence des dates
    if (
      createEventDto.endDate &&
      createEventDto.startDate >= createEventDto.endDate
    ) {
      throw new BadRequestException(
        'La date de début doit être antérieure à la date de fin',
      );
    }

    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }

  async findAll(): Promise<Event[]> {
    return await this.eventRepository.find({
      relations: ['class', 'creator', 'academicYear', 'participants'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['class', 'creator', 'academicYear', 'participants'],
    });

    if (!event) {
      throw new NotFoundException(`Événement avec l'ID ${id} non trouvé`);
    }

    return event;
  }

  async findByClass(classId: string, academicYearId: string): Promise<Event[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
    }

    return await this.eventRepository.find({
      where: { classId, academicYearId },
      relations: ['creator', 'participants'],
      order: { startDate: 'ASC' },
    });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    academicYearId?: string,
    classId?: string,
  ): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.class', 'class')
      .leftJoinAndSelect('event.creator', 'creator')
      .leftJoinAndSelect('event.academicYear', 'academicYear')
      .where('event.startDate BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });

    if (academicYearId) {
      query.andWhere('event.academicYearId = :academicYearId', {
        academicYearId,
      });
    }

    if (classId) {
      query.andWhere('event.classId = :classId', { classId });
    }

    return await query.orderBy('event.startDate', 'ASC').getMany();
  }

  async findByType(
    eventType: EventType,
    academicYearId: string,
    classId?: string,
  ): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.class', 'class')
      .leftJoinAndSelect('event.creator', 'creator')
      .where('event.eventType = :eventType', { eventType })
      .andWhere('event.academicYearId = :academicYearId', { academicYearId });

    if (classId) {
      query.andWhere('event.classId = :classId', { classId });
    }

    return await query.orderBy('event.startDate', 'ASC').getMany();
  }

  async getCalendarEvents(
    year: number,
    month: number,
    academicYearId?: string,
    classId?: string,
  ): Promise<EventCalendarDto[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const events = await this.findByDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0],
      academicYearId,
      classId,
    );

    const calendarData: { [key: string]: EventCalendarDto } = {};

    events.forEach((event) => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];

      if (!calendarData[eventDate]) {
        calendarData[eventDate] = {
          date: eventDate,
          events: [],
        };
      }

      calendarData[eventDate].events.push({
        id: event.id,
        title: event.title,
        eventType: event.eventType,
        startDate: event.startDate.toString(),
        endDate: event.endDate?.toString(),
        allDay: event.allDay,
        className: event.class?.name,
      });
    });

    return Object.values(calendarData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  async getUpcomingEvents(
    academicYearId: string,
    limit: number = 10,
    classId?: string,
  ): Promise<Event[]> {
    const today = new Date().toISOString().split('T')[0];

    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.class', 'class')
      .leftJoinAndSelect('event.creator', 'creator')
      .where('event.startDate >= :today', { today })
      .andWhere('event.academicYearId = :academicYearId', { academicYearId });

    if (classId) {
      query.andWhere('event.classId = :classId', { classId });
    }

    return await query.orderBy('event.startDate', 'ASC').limit(limit).getMany();
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const event = await this.findOne(id);

    // Vérifier la cohérence des dates si elles sont modifiées
    const startDate =
      updateEventDto.startDate || event.startDate.toISOString().split('T')[0];
    const endDate =
      updateEventDto.endDate ||
      (event.endDate ? event.endDate.toISOString().split('T')[0] : undefined);

    if (endDate && startDate >= endDate) {
      throw new BadRequestException(
        'La date de début doit être antérieure à la date de fin',
      );
    }

    Object.assign(event, updateEventDto);
    return await this.eventRepository.save(event);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
  }
}
