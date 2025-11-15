import { TimetableService } from './timetable.service';
import { CreateTimetableDto, UpdateTimetableDto, WeeklyTimetableDto } from './dto/timetable.dto';
export declare class TimetableController {
    private readonly timetableService;
    constructor(timetableService: TimetableService);
    create(createTimetableDto: CreateTimetableDto): Promise<import("../../entities/timetable.entity").Timetable>;
    findAll(): Promise<import("../../entities/timetable.entity").Timetable[]>;
    findByClass(classId: string, academicYearId: string): Promise<import("../../entities/timetable.entity").Timetable[]>;
    findByTeacher(teacherId: string, academicYearId: string): Promise<import("../../entities/timetable.entity").Timetable[]>;
    getWeeklyTimetable(classId: string, academicYearId: string): Promise<WeeklyTimetableDto>;
    findOne(id: string): Promise<import("../../entities/timetable.entity").Timetable>;
    update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<import("../../entities/timetable.entity").Timetable>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
