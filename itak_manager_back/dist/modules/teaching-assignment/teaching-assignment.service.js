"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachingAssignmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teaching_assignment_entity_1 = require("../../entities/teaching-assignment.entity");
const teacher_entity_1 = require("../../entities/teacher.entity");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
let TeachingAssignmentService = class TeachingAssignmentService {
    teachingAssignmentRepository;
    teacherRepository;
    classSubjectRepository;
    constructor(teachingAssignmentRepository, teacherRepository, classSubjectRepository) {
        this.teachingAssignmentRepository = teachingAssignmentRepository;
        this.teacherRepository = teacherRepository;
        this.classSubjectRepository = classSubjectRepository;
    }
    async createTeachingAssignment(createTeachingAssignmentDto) {
        try {
            const teacher = await this.teacherRepository.findOne({
                where: { id: createTeachingAssignmentDto.teacherId },
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Professeur non trouvé');
            }
            const classSubject = await this.classSubjectRepository.findOne({
                where: { id: createTeachingAssignmentDto.classSubjectId },
            });
            if (!classSubject) {
                throw new common_1.NotFoundException('Association classe-matière non trouvée');
            }
            const existingAssignment = await this.teachingAssignmentRepository.findOne({
                where: {
                    teacherId: createTeachingAssignmentDto.teacherId,
                    classSubjectId: createTeachingAssignmentDto.classSubjectId,
                },
            });
            if (existingAssignment) {
                throw new common_1.ConflictException('Ce professeur est déjà affecté à cette classe-matière');
            }
            if (createTeachingAssignmentDto.endDate) {
                const startDate = new Date(createTeachingAssignmentDto.startDate);
                const endDate = new Date(createTeachingAssignmentDto.endDate);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                if (endDate < startDate) {
                    throw new common_1.BadRequestException('La date de fin doit être postérieure ou égale à la date de début');
                }
            }
            const teachingAssignment = this.teachingAssignmentRepository.create(createTeachingAssignmentDto);
            const savedAssignment = await this.teachingAssignmentRepository.save(teachingAssignment);
            const assignmentWithRelations = await this.teachingAssignmentRepository.findOne({
                where: { id: savedAssignment.id },
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
            });
            if (!assignmentWithRelations) {
                throw new Error("Erreur lors de la récupération de l'affectation créée");
            }
            return this.mapToTeachingAssignmentResponseDto(assignmentWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'affectation: ${message}`);
        }
    }
    async getAllTeachingAssignments() {
        try {
            const assignments = await this.teachingAssignmentRepository.find({
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
                order: { startDate: 'DESC' },
            });
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponseDto(assignment));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des affectations: ${message}`);
        }
    }
    async getTeachingAssignmentById(id) {
        try {
            const assignment = await this.teachingAssignmentRepository.findOne({
                where: { id },
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
            });
            if (!assignment) {
                throw new common_1.NotFoundException('Affectation non trouvée');
            }
            return this.mapToTeachingAssignmentResponseDto(assignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'affectation: ${message}`);
        }
    }
    async getTeachingAssignmentsByTeacher(teacherId) {
        try {
            const assignments = await this.teachingAssignmentRepository.find({
                where: { teacherId },
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
                order: { startDate: 'DESC' },
            });
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponseDto(assignment));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des affectations du professeur: ${message}`);
        }
    }
    async getTeachingAssignmentsByClassSubject(classSubjectId) {
        try {
            const assignments = await this.teachingAssignmentRepository.find({
                where: { classSubjectId },
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
                order: { startDate: 'DESC' },
            });
            return assignments.map((assignment) => this.mapToTeachingAssignmentResponseDto(assignment));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des affectations pour la classe-matière: ${message}`);
        }
    }
    async updateTeachingAssignment(id, updateTeachingAssignmentDto) {
        try {
            await this.getTeachingAssignmentById(id);
            if (updateTeachingAssignmentDto.teacherId) {
                const teacher = await this.teacherRepository.findOne({
                    where: { id: updateTeachingAssignmentDto.teacherId },
                });
                if (!teacher) {
                    throw new common_1.NotFoundException('Professeur non trouvé');
                }
            }
            if (updateTeachingAssignmentDto.classSubjectId) {
                const classSubject = await this.classSubjectRepository.findOne({
                    where: { id: updateTeachingAssignmentDto.classSubjectId },
                });
                if (!classSubject) {
                    throw new common_1.NotFoundException('Association classe-matière non trouvée');
                }
            }
            if (updateTeachingAssignmentDto.teacherId ||
                updateTeachingAssignmentDto.classSubjectId) {
                const currentAssignment = await this.teachingAssignmentRepository.findOne({
                    where: { id },
                });
                const newTeacherId = updateTeachingAssignmentDto.teacherId || currentAssignment?.teacherId;
                const newClassSubjectId = updateTeachingAssignmentDto.classSubjectId ||
                    currentAssignment?.classSubjectId;
                const existingAssignment = await this.teachingAssignmentRepository.findOne({
                    where: {
                        teacherId: newTeacherId,
                        classSubjectId: newClassSubjectId,
                    },
                });
                if (existingAssignment && existingAssignment.id !== id) {
                    throw new common_1.ConflictException('Ce professeur est déjà affecté à cette classe-matière');
                }
            }
            await this.teachingAssignmentRepository.update(id, updateTeachingAssignmentDto);
            const updatedAssignment = await this.teachingAssignmentRepository.findOne({
                where: { id },
                relations: [
                    'teacher',
                    'teacher.user',
                    'classSubject',
                    'classSubject.class',
                    'classSubject.subject',
                ],
            });
            if (!updatedAssignment) {
                throw new common_1.NotFoundException('Affectation non trouvée après mise à jour');
            }
            return this.mapToTeachingAssignmentResponseDto(updatedAssignment);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'affectation: ${message}`);
        }
    }
    async deleteTeachingAssignment(id) {
        try {
            await this.getTeachingAssignmentById(id);
            await this.teachingAssignmentRepository.delete(id);
            return { message: 'Affectation supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'affectation: ${message}`);
        }
    }
    mapToTeachingAssignmentResponseDto(assignment) {
        return {
            id: assignment.id,
            startDate: assignment.startDate,
            endDate: assignment.endDate,
            coefficient: assignment.classSubject?.coefficient,
            class: assignment.classSubject?.class,
            subject: assignment.classSubject?.subject,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            teacher: {
                id: assignment.teacher.id,
                matricule: assignment.teacher.matricule,
                hireDate: assignment.teacher.hireDate,
                subjects: assignment.teacher.subjects || [],
                createdAt: assignment.teacher.createdAt,
                updatedAt: assignment.teacher.updatedAt,
                user: {
                    id: assignment.teacher.user.id,
                    username: assignment.teacher.user.username,
                    firstName: assignment.teacher.user.firstName,
                    lastName: assignment.teacher.user.lastName,
                    gender: assignment.teacher.user.gender,
                    birthDate: assignment.teacher.user.birthDate,
                    phone: assignment.teacher.user.phone,
                    role: assignment.teacher.user.role,
                    isActive: assignment.teacher.user.isActive,
                    email: assignment.teacher.user.email,
                    createdAt: assignment.teacher.user.createdAt,
                    updatedAt: assignment.teacher.user.updatedAt,
                },
            },
            classSubject: assignment.classSubject
                ? {
                    id: assignment.classSubject.id,
                    coefficient: assignment.classSubject.coefficient,
                    classId: assignment.classSubject.classId,
                    subjectId: assignment.classSubject.subjectId,
                    weeklyHours: assignment.classSubject.weeklyHours,
                    isOptional: assignment.classSubject.isOptional,
                    createdAt: assignment.classSubject.createdAt,
                    updatedAt: assignment.classSubject.updatedAt,
                    class: assignment.classSubject.class
                        ? {
                            id: assignment.classSubject.class.id,
                            name: assignment.classSubject.class.name,
                            code: assignment.classSubject.class.code,
                            description: assignment.classSubject.class.description,
                        }
                        : undefined,
                    subject: assignment.classSubject.subject
                        ? {
                            id: assignment.classSubject.subject.id,
                            name: assignment.classSubject.subject.name,
                            code: assignment.classSubject.subject.code,
                        }
                        : undefined,
                }
                : undefined,
        };
    }
};
exports.TeachingAssignmentService = TeachingAssignmentService;
exports.TeachingAssignmentService = TeachingAssignmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teaching_assignment_entity_1.TeachingAssignment)),
    __param(1, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(2, (0, typeorm_1.InjectRepository)(class_subject_entity_1.ClassSubject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeachingAssignmentService);
//# sourceMappingURL=teaching-assignment.service.js.map