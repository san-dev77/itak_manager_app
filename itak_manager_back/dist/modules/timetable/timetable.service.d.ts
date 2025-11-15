import { Repository } from 'typeorm';
import { Timetable } from '../../entities/timetable.entity';
import { TeachingAssignment } from '../../entities/teaching-assignment.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import { Class } from '../../entities/class.entity';
import { User } from '../../entities/user.entity';
import { CreateTimetableDto, UpdateTimetableDto, WeeklyTimetableDto } from './dto/timetable.dto';
export declare class TimetableService {
    private readonly timetableRepository;
    private readonly teachingAssignmentRepository;
    private readonly schoolYearRepository;
    private readonly classRepository;
    private readonly userRepository;
    constructor(timetableRepository: Repository<Timetable>, teachingAssignmentRepository: Repository<TeachingAssignment>, schoolYearRepository: Repository<SchoolYear>, classRepository: Repository<Class>, userRepository: Repository<User>);
    create(createTimetableDto: CreateTimetableDto): Promise<Timetable>;
    findAll(): Promise<Timetable[]>;
    findOne(id: string): Promise<Timetable>;
    findByClass(classId: string, academicYearId: string): Promise<Timetable[]>;
    findByTeacher(teacherId: string, academicYearId: string): Promise<Timetable[]>;
    getWeeklyTimetable(classId: string, academicYearId: string): Promise<WeeklyTimetableDto>;
    update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<Timetable>;
    remove(id: string): Promise<void>;
    private checkClassTimeConflict;
    private checkTeacherTimeConflict;
}
