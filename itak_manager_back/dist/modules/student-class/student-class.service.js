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
exports.StudentClassService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_class_entity_1 = require("../../entities/student-class.entity");
const student_entity_1 = require("../../entities/student.entity");
const class_entity_1 = require("../../entities/class.entity");
let StudentClassService = class StudentClassService {
    studentClassRepository;
    studentRepository;
    classRepository;
    constructor(studentClassRepository, studentRepository, classRepository) {
        this.studentClassRepository = studentClassRepository;
        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
    }
    async createStudentClass(createStudentClassDto) {
        try {
            const student = await this.studentRepository.findOne({
                where: { id: createStudentClassDto.studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            const classEntity = await this.classRepository.findOne({
                where: { id: createStudentClassDto.classId },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            const existingStudentClass = await this.studentClassRepository.findOne({
                where: {
                    studentId: createStudentClassDto.studentId,
                    classId: createStudentClassDto.classId,
                },
            });
            if (existingStudentClass) {
                throw new common_1.ConflictException('Cet étudiant est déjà inscrit dans cette classe');
            }
            if (createStudentClassDto.endDate) {
                const startDate = new Date(createStudentClassDto.startDate);
                const endDate = new Date(createStudentClassDto.endDate);
                if (endDate < startDate) {
                    throw new common_1.ConflictException('La date de fin doit être postérieure ou égale à la date de début');
                }
            }
            const startDate = new Date(createStudentClassDto.startDate);
            const year = startDate.getFullYear();
            const nextYear = year + 1;
            const schoolYear = `${year}-${nextYear}`;
            const studentClass = this.studentClassRepository.create({
                ...createStudentClassDto,
                year: schoolYear,
            });
            const savedStudentClass = await this.studentClassRepository.save(studentClass);
            const studentClassWithRelations = await this.studentClassRepository.findOne({
                where: { id: savedStudentClass.id },
                relations: ['student', 'student.user', 'class'],
            });
            if (!studentClassWithRelations) {
                throw new Error("Erreur lors de la récupération de l'inscription créée");
            }
            return this.mapToStudentClassResponseDto(studentClassWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'inscription: ${message}`);
        }
    }
    async getAllStudentClasses() {
        try {
            const studentClasses = await this.studentClassRepository.find({
                relations: ['student', 'student.user', 'class'],
                order: { startDate: 'DESC' },
            });
            return studentClasses.map((studentClass) => this.mapToStudentClassResponseDto(studentClass));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des inscriptions: ${message}`);
        }
    }
    async getStudentClassById(id) {
        try {
            const studentClass = await this.studentClassRepository.findOne({
                where: { id },
                relations: ['student', 'student.user', 'class'],
            });
            if (!studentClass) {
                throw new common_1.NotFoundException('Inscription non trouvée');
            }
            return this.mapToStudentClassResponseDto(studentClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'inscription: ${message}`);
        }
    }
    async getStudentClassesByStudent(studentId) {
        try {
            const studentClasses = await this.studentClassRepository.find({
                where: { studentId },
                relations: ['student', 'student.user', 'class'],
                order: { startDate: 'DESC' },
            });
            return studentClasses.map((studentClass) => this.mapToStudentClassResponseDto(studentClass));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes de l'étudiant: ${message}`);
        }
    }
    async getStudentClassesByClass(classId) {
        try {
            const studentClasses = await this.studentClassRepository.find({
                where: { classId },
                relations: ['student', 'student.user', 'class'],
                order: { startDate: 'DESC' },
            });
            return studentClasses.map((studentClass) => this.mapToStudentClassResponseDto(studentClass));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des étudiants de la classe: ${message}`);
        }
    }
    async updateStudentClass(id, updateStudentClassDto) {
        try {
            await this.getStudentClassById(id);
            if (updateStudentClassDto.studentId) {
                const student = await this.studentRepository.findOne({
                    where: { id: updateStudentClassDto.studentId },
                });
                if (!student) {
                    throw new common_1.NotFoundException('Étudiant non trouvé');
                }
            }
            if (updateStudentClassDto.classId) {
                const classEntity = await this.classRepository.findOne({
                    where: { id: updateStudentClassDto.classId },
                });
                if (!classEntity) {
                    throw new common_1.NotFoundException('Classe non trouvée');
                }
            }
            if (updateStudentClassDto.studentId || updateStudentClassDto.classId) {
                const currentStudentClass = await this.studentClassRepository.findOne({
                    where: { id },
                });
                const newStudentId = updateStudentClassDto.studentId || currentStudentClass?.studentId;
                const newClassId = updateStudentClassDto.classId || currentStudentClass?.classId;
                const existingStudentClass = await this.studentClassRepository.findOne({
                    where: {
                        studentId: newStudentId,
                        classId: newClassId,
                    },
                });
                if (existingStudentClass && existingStudentClass.id !== id) {
                    throw new common_1.ConflictException('Cet étudiant est déjà inscrit dans cette classe');
                }
            }
            await this.studentClassRepository.update(id, updateStudentClassDto);
            const updatedStudentClass = await this.studentClassRepository.findOne({
                where: { id },
                relations: ['student', 'student.user', 'class'],
            });
            if (!updatedStudentClass) {
                throw new common_1.NotFoundException('Inscription non trouvée après mise à jour');
            }
            return this.mapToStudentClassResponseDto(updatedStudentClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'inscription: ${message}`);
        }
    }
    async deleteStudentClass(id) {
        try {
            await this.getStudentClassById(id);
            await this.studentClassRepository.delete(id);
            return { message: 'Inscription supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'inscription: ${message}`);
        }
    }
    mapToStudentClassResponseDto(studentClass) {
        return {
            id: studentClass.id,
            studentId: studentClass.studentId,
            classId: studentClass.classId,
            startDate: studentClass.startDate,
            endDate: studentClass.endDate,
            year: studentClass.year,
            createdAt: studentClass.createdAt,
            updatedAt: studentClass.updatedAt,
            student: {
                id: studentClass.student.id,
                matricule: studentClass.student.matricule,
                userId: studentClass.student.userId,
                enrollmentDate: studentClass.student.enrollmentDate,
                createdAt: studentClass.student.createdAt,
                updatedAt: studentClass.student.updatedAt,
                photo: studentClass.student.photo,
                maritalStatus: studentClass.student.maritalStatus,
                fatherName: studentClass.student.fatherName,
                motherName: studentClass.student.motherName,
                tutorName: studentClass.student.tutorName,
                tutorPhone: studentClass.student.tutorPhone,
                address: studentClass.student.address,
                emergencyContact: studentClass.student.emergencyContact,
                notes: studentClass.student.notes,
                user: {
                    id: studentClass.student.user.id,
                    username: studentClass.student.user.username,
                    firstName: studentClass.student.user.firstName,
                    lastName: studentClass.student.user.lastName,
                    gender: studentClass.student.user.gender,
                    birthDate: studentClass.student.user.birthDate,
                    email: studentClass.student.user.email,
                    role: studentClass.student.user.role,
                    isActive: studentClass.student.user.isActive,
                    phone: studentClass.student.user.phone,
                    createdAt: studentClass.student.user.createdAt,
                    updatedAt: studentClass.student.user.updatedAt,
                },
            },
            class: {
                id: studentClass.class.id,
                name: studentClass.class.name,
                code: studentClass.class.code,
                description: studentClass.class.description,
                level: studentClass.class.level,
                capacity: studentClass.class.capacity,
                orderLevel: studentClass.class.orderLevel,
                createdAt: studentClass.class.createdAt,
                updatedAt: studentClass.class.updatedAt,
                classCategory: studentClass.class.classCategory,
                classSubjects: studentClass.class.classSubjects,
                studentClasses: studentClass.class.studentClasses,
            },
        };
    }
};
exports.StudentClassService = StudentClassService;
exports.StudentClassService = StudentClassService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_class_entity_1.StudentClass)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentClassService);
//# sourceMappingURL=student-class.service.js.map