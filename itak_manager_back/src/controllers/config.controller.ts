import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { ClassSubjectService } from '../services/class-subject.service';
import { StudentClassService } from '../services/student-class.service';
import { TeachingAssignmentService } from '../services/teaching-assignment.service';
import {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from '../dto/class-subject.dto';
import {
  CreateStudentClassDto,
  UpdateStudentClassDto,
} from '../dto/student-class.dto';
import {
  CreateTeachingAssignmentDto,
  UpdateTeachingAssignmentDto,
} from '../dto/teaching-assignment.dto';
import type { ClassSubjectResponse } from '../models/class-subject.model';
import type { StudentClassResponse } from '../models/student-class.model';
import type { TeachingAssignmentResponse } from '../models/teaching-assignment.model';

@Controller('config')
export class ConfigController {
  constructor(
    private readonly classSubjectService: ClassSubjectService,
    private readonly studentClassService: StudentClassService,
    private readonly teachingAssignmentService: TeachingAssignmentService,
  ) {}

  // ========================================
  // ENDPOINTS POUR CLASS_SUBJECTS
  // ========================================

  @Post('class-subjects')
  @HttpCode(HttpStatus.CREATED)
  async createClassSubject(
    @Body(ValidationPipe) createClassSubjectDto: CreateClassSubjectDto,
  ): Promise<ClassSubjectResponse> {
    return this.classSubjectService.createClassSubject(createClassSubjectDto);
  }

  @Get('class-subjects')
  async getAllClassSubjects(): Promise<ClassSubjectResponse[]> {
    return this.classSubjectService.getAllClassSubjects();
  }

  @Get('class-subjects/:id')
  async getClassSubjectById(
    @Param('id') id: string,
  ): Promise<ClassSubjectResponse> {
    return this.classSubjectService.getClassSubjectById(parseInt(id, 10));
  }

  @Get('class-subjects/class/:classId')
  async getClassSubjectsByClass(
    @Param('classId') classId: string,
  ): Promise<ClassSubjectResponse[]> {
    return this.classSubjectService.getClassSubjectsByClass(
      parseInt(classId, 10),
    );
  }

  @Get('class-subjects/subject/:subjectId')
  async getClassSubjectsBySubject(
    @Param('subjectId') subjectId: string,
  ): Promise<ClassSubjectResponse[]> {
    return this.classSubjectService.getClassSubjectsBySubject(
      parseInt(subjectId, 10),
    );
  }

  @Put('class-subjects/:id')
  async updateClassSubject(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassSubjectDto: UpdateClassSubjectDto,
  ): Promise<ClassSubjectResponse> {
    return this.classSubjectService.updateClassSubject(
      parseInt(id, 10),
      updateClassSubjectDto,
    );
  }

  @Delete('class-subjects/:id')
  @HttpCode(HttpStatus.OK)
  async deleteClassSubject(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.classSubjectService.deleteClassSubject(parseInt(id, 10));
  }

  // ========================================
  // ENDPOINTS POUR STUDENT_CLASSES
  // ========================================

  @Post('student-classes')
  @HttpCode(HttpStatus.CREATED)
  async createStudentClass(
    @Body(ValidationPipe) createStudentClassDto: CreateStudentClassDto,
  ): Promise<StudentClassResponse> {
    return this.studentClassService.createStudentClass(createStudentClassDto);
  }

  @Get('student-classes')
  async getAllStudentClasses(): Promise<StudentClassResponse[]> {
    return this.studentClassService.getAllStudentClasses();
  }

  @Get('student-classes/:id')
  async getStudentClassById(
    @Param('id') id: string,
  ): Promise<StudentClassResponse> {
    return this.studentClassService.getStudentClassById(parseInt(id, 10));
  }

  @Get('student-classes/student/:studentId')
  async getStudentClassesByStudent(
    @Param('studentId') studentId: string,
  ): Promise<StudentClassResponse[]> {
    return this.studentClassService.getStudentClassesByStudent(
      parseInt(studentId, 10),
    );
  }

  @Get('student-classes/class/:classId')
  async getStudentClassesByClass(
    @Param('classId') classId: string,
  ): Promise<StudentClassResponse[]> {
    return this.studentClassService.getStudentClassesByClass(
      parseInt(classId, 10),
    );
  }

  @Put('student-classes/:id')
  async updateStudentClass(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStudentClassDto: UpdateStudentClassDto,
  ): Promise<StudentClassResponse> {
    return this.studentClassService.updateStudentClass(
      parseInt(id, 10),
      updateStudentClassDto,
    );
  }

  @Delete('student-classes/:id')
  @HttpCode(HttpStatus.OK)
  async deleteStudentClass(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.studentClassService.deleteStudentClass(parseInt(id, 10));
  }

  // ========================================
  // ENDPOINTS POUR TEACHING_ASSIGNMENTS
  // ========================================

  @Post('teaching-assignments')
  @HttpCode(HttpStatus.CREATED)
  async createTeachingAssignment(
    @Body(ValidationPipe)
    createTeachingAssignmentDto: CreateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponse> {
    return this.teachingAssignmentService.createTeachingAssignment(
      createTeachingAssignmentDto,
    );
  }

  @Get('teaching-assignments')
  async getAllTeachingAssignments(): Promise<TeachingAssignmentResponse[]> {
    return this.teachingAssignmentService.getAllTeachingAssignments();
  }

  @Get('teaching-assignments/:id')
  async getTeachingAssignmentById(
    @Param('id') id: string,
  ): Promise<TeachingAssignmentResponse> {
    return this.teachingAssignmentService.getTeachingAssignmentById(
      parseInt(id, 10),
    );
  }

  @Get('teaching-assignments/teacher/:teacherId')
  async getTeachingAssignmentsByTeacher(
    @Param('teacherId') teacherId: string,
  ): Promise<TeachingAssignmentResponse[]> {
    return this.teachingAssignmentService.getTeachingAssignmentsByTeacher(
      parseInt(teacherId, 10),
    );
  }

  @Get('teaching-assignments/class-subject/:classSubjectId')
  async getTeachingAssignmentsByClassSubject(
    @Param('classSubjectId') classSubjectId: string,
  ): Promise<TeachingAssignmentResponse[]> {
    return this.teachingAssignmentService.getTeachingAssignmentsByClassSubject(
      parseInt(classSubjectId, 10),
    );
  }

  @Put('teaching-assignments/:id')
  async updateTeachingAssignment(
    @Param('id') id: string,
    @Body(ValidationPipe)
    updateTeachingAssignmentDto: UpdateTeachingAssignmentDto,
  ): Promise<TeachingAssignmentResponse> {
    return this.teachingAssignmentService.updateTeachingAssignment(
      parseInt(id, 10),
      updateTeachingAssignmentDto,
    );
  }

  @Delete('teaching-assignments/:id')
  @HttpCode(HttpStatus.OK)
  async deleteTeachingAssignment(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return this.teachingAssignmentService.deleteTeachingAssignment(
      parseInt(id, 10),
    );
  }
}
