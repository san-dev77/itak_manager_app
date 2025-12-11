import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Timetable, DayOfWeek } from '../../entities/timetable.entity';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import {
  CreateTimetableDto,
  UpdateTimetableDto,
  WeeklyTimetableDto,
} from './dto/timetable.dto';

@Injectable()
export class TimetableService {
  constructor(
    @InjectRepository(Timetable)
    private readonly timetableRepository: Repository<Timetable>,
    @InjectRepository(TeachingAssignment)
    private readonly teachingAssignmentRepository: Repository<TeachingAssignment>,
    @InjectRepository(SchoolYear)
    private readonly schoolYearRepository: Repository<SchoolYear>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTimetableDto: CreateTimetableDto): Promise<Timetable> {
    // Vérifier que l'affectation d'enseignement existe
    const teachingAssignment = await this.teachingAssignmentRepository.findOne({
      where: { id: createTimetableDto.teachingAssignmentId },
      relations: [
        'teacher',
        'teacher.user',
        'classSubject',
        'classSubject.class',
        'classSubject.subject',
      ],
    });

    if (!teachingAssignment) {
      throw new NotFoundException(
        `Affectation d'enseignement avec l'ID ${createTimetableDto.teachingAssignmentId} non trouvée`,
      );
    }

    // Vérifier que l'année scolaire existe
    const academicYear = await this.schoolYearRepository.findOne({
      where: { id: createTimetableDto.academicYearId },
    });
    if (!academicYear) {
      throw new NotFoundException(
        `Année scolaire avec l'ID ${createTimetableDto.academicYearId} non trouvée`,
      );
    }

    // Vérifier la cohérence des heures
    if (createTimetableDto.startTime >= createTimetableDto.endTime) {
      throw new BadRequestException(
        "L'heure de début doit être antérieure à l'heure de fin",
      );
    }

    // Vérifier les conflits d'horaires pour la classe
    await this.checkClassTimeConflict(
      teachingAssignment.classSubject.class.id,
      createTimetableDto.academicYearId,
      createTimetableDto.dayOfWeek,
      createTimetableDto.startTime,
      createTimetableDto.endTime,
    );

    // Vérifier les conflits d'horaires pour l'enseignant
    const teacherConflict = await this.checkTeacherTimeConflict(
      teachingAssignment.teacher.id,
      createTimetableDto.academicYearId,
      createTimetableDto.dayOfWeek,
      createTimetableDto.startTime,
      createTimetableDto.endTime,
    );
    if (teacherConflict) {
      throw new ConflictException(
        `Conflit d'horaire pour l'enseignant ${teachingAssignment.teacher.user.firstName} ${teachingAssignment.teacher.user.lastName} le ${createTimetableDto.dayOfWeek} de ${createTimetableDto.startTime} à ${createTimetableDto.endTime}`,
      );
    }

    const timetable = this.timetableRepository.create(createTimetableDto);
    return await this.timetableRepository.save(timetable);
  }

  async findAll(): Promise<Timetable[]> {
    return await this.timetableRepository.find({
      relations: [
        'teachingAssignment',
        'teachingAssignment.teacher',
        'teachingAssignment.teacher.user',
        'teachingAssignment.classSubject',
        'teachingAssignment.classSubject.class',
        'teachingAssignment.classSubject.subject',
        'academicYear',
      ],
      order: { dayOfWeek: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Timetable> {
    const timetable = await this.timetableRepository.findOne({
      where: { id },
      relations: [
        'teachingAssignment',
        'teachingAssignment.teacher',
        'teachingAssignment.teacher.user',
        'teachingAssignment.classSubject',
        'teachingAssignment.classSubject.class',
        'teachingAssignment.classSubject.subject',
        'academicYear',
      ],
    });

    if (!timetable) {
      throw new NotFoundException(`Emploi du temps avec l'ID ${id} non trouvé`);
    }

    return timetable;
  }

  async findByClass(
    classId: string,
    academicYearId: string,
  ): Promise<Timetable[]> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
    }

    return await this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.teachingAssignment', 'teachingAssignment')
      .leftJoinAndSelect('teachingAssignment.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('teachingAssignment.classSubject', 'classSubject')
      .leftJoinAndSelect('classSubject.class', 'class')
      .leftJoinAndSelect('classSubject.subject', 'subject')
      .where('class.id = :classId', { classId })
      .andWhere('timetable.academicYearId = :academicYearId', {
        academicYearId,
      })
      .orderBy('timetable.dayOfWeek', 'ASC')
      .addOrderBy('timetable.startTime', 'ASC')
      .getMany();
  }

  async findByTeacher(
    teacherId: string,
    academicYearId: string,
  ): Promise<Timetable[]> {
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(
        `Enseignant avec l'ID ${teacherId} non trouvé`,
      );
    }

    return await this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoinAndSelect('timetable.teachingAssignment', 'teachingAssignment')
      .leftJoinAndSelect('teachingAssignment.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'user')
      .leftJoinAndSelect('teachingAssignment.classSubject', 'classSubject')
      .leftJoinAndSelect('classSubject.class', 'class')
      .leftJoinAndSelect('classSubject.subject', 'subject')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('timetable.academicYearId = :academicYearId', {
        academicYearId,
      })
      .orderBy('timetable.dayOfWeek', 'ASC')
      .addOrderBy('timetable.startTime', 'ASC')
      .getMany();
  }

  async getWeeklyTimetable(
    classId: string,
    academicYearId: string,
  ): Promise<WeeklyTimetableDto> {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException(`Classe avec l'ID ${classId} non trouvée`);
    }

    const timetables = await this.findByClass(classId, academicYearId);

    const schedule: WeeklyTimetableDto['schedule'] = {};

    timetables.forEach((timetable) => {
      if (!schedule[timetable.dayOfWeek]) {
        schedule[timetable.dayOfWeek] = [];
      }

      schedule[timetable.dayOfWeek]!.push({
        id: timetable.id,
        startTime: timetable.startTime,
        endTime: timetable.endTime,
        subject: timetable.teachingAssignment.classSubject.subject.name,
        teacher: `${timetable.teachingAssignment.teacher.user.firstName} ${timetable.teachingAssignment.teacher.user.lastName}`,
        room: timetable.room,
        teachingAssignmentId: timetable.teachingAssignmentId,
      });
    });

    return {
      classId,
      className: classEntity.name,
      academicYearId,
      schedule,
    };
  }

  async update(
    id: string,
    updateTimetableDto: UpdateTimetableDto,
  ): Promise<Timetable> {
    const timetable = await this.findOne(id);

    // Si les heures sont modifiées, vérifier la cohérence
    const startTime = updateTimetableDto.startTime || timetable.startTime;
    const endTime = updateTimetableDto.endTime || timetable.endTime;

    if (startTime >= endTime) {
      throw new BadRequestException(
        "L'heure de début doit être antérieure à l'heure de fin",
      );
    }

    Object.assign(timetable, updateTimetableDto);
    return await this.timetableRepository.save(timetable);
  }

  async remove(id: string): Promise<void> {
    const timetable = await this.findOne(id);
    await this.timetableRepository.remove(timetable);
  }

  private async checkClassTimeConflict(
    classId: string,
    academicYearId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query = this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoin('timetable.teachingAssignment', 'teachingAssignment')
      .leftJoin('teachingAssignment.classSubject', 'classSubject')
      .leftJoin('classSubject.class', 'class')
      .where('class.id = :classId', { classId })
      .andWhere('timetable.academicYearId = :academicYearId', {
        academicYearId,
      })
      .andWhere('timetable.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere(
        '(timetable.startTime < :endTime AND timetable.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeId) {
      query.andWhere('timetable.id != :excludeId', { excludeId });
    }

    const conflict = await query.getOne();
    return !!conflict;
  }

  private async checkTeacherTimeConflict(
    teacherId: string,
    academicYearId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query = this.timetableRepository
      .createQueryBuilder('timetable')
      .leftJoin('timetable.teachingAssignment', 'teachingAssignment')
      .leftJoin('teachingAssignment.teacher', 'teacher')
      .where('teacher.id = :teacherId', { teacherId })
      .andWhere('timetable.academicYearId = :academicYearId', {
        academicYearId,
      })
      .andWhere('timetable.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere(
        '(timetable.startTime < :endTime AND timetable.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeId) {
      query.andWhere('timetable.id != :excludeId', { excludeId });
    }

    const conflict = await query.getOne();
    return !!conflict;
  }
}
