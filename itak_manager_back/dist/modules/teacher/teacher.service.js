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
exports.TeacherService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const teacher_entity_1 = require("../../entities/teacher.entity");
const user_entity_1 = require("../../entities/user.entity");
const subject_entity_1 = require("../../entities/subject.entity");
let TeacherService = class TeacherService {
    teacherRepository;
    userRepository;
    subjectRepository;
    constructor(teacherRepository, userRepository, subjectRepository) {
        this.teacherRepository = teacherRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }
    async createTeacher(createTeacherDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: createTeacherDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            const existingTeacher = await this.teacherRepository.findOne({
                where: { matricule: createTeacherDto.matricule },
            });
            if (existingTeacher) {
                throw new common_1.ConflictException('Ce matricule existe déjà');
            }
            const teacherExists = await this.teacherRepository.findOne({
                where: { userId: createTeacherDto.userId },
            });
            if (teacherExists) {
                throw new common_1.ConflictException('Cet utilisateur est déjà enregistré comme enseignant');
            }
            let subjects = [];
            if (createTeacherDto.subjectIds &&
                createTeacherDto.subjectIds.length > 0) {
                subjects = await this.subjectRepository.find({
                    where: { id: (0, typeorm_2.In)(createTeacherDto.subjectIds) },
                });
            }
            const teacher = this.teacherRepository.create({
                userId: createTeacherDto.userId,
                matricule: createTeacherDto.matricule,
                hireDate: new Date(createTeacherDto.hireDate),
                photo: createTeacherDto.photo,
                maritalStatus: createTeacherDto.maritalStatus,
                diplomas: createTeacherDto.diplomas,
                address: createTeacherDto.address,
                emergencyContact: createTeacherDto.emergencyContact,
                notes: createTeacherDto.notes,
                subjects,
            });
            const savedTeacher = await this.teacherRepository.save(teacher);
            const teacherWithRelations = await this.teacherRepository.findOne({
                where: { id: savedTeacher.id },
                relations: ['user', 'subjects'],
            });
            return this.mapToTeacherResponse(teacherWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'enseignant: ${message}`);
        }
    }
    async getAllTeachers() {
        try {
            const teachers = await this.teacherRepository.find({
                relations: ['user'],
                order: { createdAt: 'DESC' },
            });
            return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des enseignants: ${message}`);
        }
    }
    async getTeacherById(id) {
        try {
            const teacher = await this.teacherRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${message}`);
        }
    }
    async getTeacherByUserId(userId) {
        try {
            const teacher = await this.teacherRepository.findOne({
                where: { userId },
                relations: ['user'],
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${message}`);
        }
    }
    async getTeacherByMatricule(matricule) {
        try {
            const teacher = await this.teacherRepository.findOne({
                where: { matricule },
                relations: ['user'],
            });
            if (!teacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé');
            }
            return this.mapToTeacherResponse(teacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'enseignant: ${message}`);
        }
    }
    async getTeachersBySubject(subjectId) {
        try {
            const teachers = await this.teacherRepository.find({
                where: {
                    subjects: {
                        id: subjectId,
                    },
                },
                relations: ['user', 'subjects'],
                order: { createdAt: 'DESC' },
            });
            return teachers.map((teacher) => this.mapToTeacherResponse(teacher));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des enseignants: ${message}`);
        }
    }
    async updateTeacher(id, updateTeacherDto) {
        try {
            await this.getTeacherById(id);
            const updateData = { ...updateTeacherDto };
            if (updateTeacherDto.hireDate) {
                updateData.hireDate = updateTeacherDto.hireDate;
            }
            await this.teacherRepository.update(id, updateData);
            const updatedTeacher = await this.teacherRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!updatedTeacher) {
                throw new common_1.NotFoundException('Enseignant non trouvé après mise à jour');
            }
            return this.mapToTeacherResponse(updatedTeacher);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'enseignant: ${message}`);
        }
    }
    async deleteTeacher(id) {
        try {
            await this.getTeacherById(id);
            await this.teacherRepository.delete(id);
            return { message: 'Enseignant supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'enseignant: ${message}`);
        }
    }
    mapToTeacherResponse(teacher) {
        return {
            id: teacher.id,
            matricule: teacher.matricule,
            hireDate: teacher.hireDate,
            photo: teacher.photo,
            maritalStatus: teacher.maritalStatus,
            subjects: teacher.subjects || [],
            diplomas: teacher.diplomas,
            address: teacher.address,
            emergencyContact: teacher.emergencyContact,
            notes: teacher.notes,
            createdAt: teacher.createdAt,
            updatedAt: teacher.updatedAt,
            user: {
                id: teacher.user.id,
                username: teacher.user.username,
                email: teacher.user.email,
                firstName: teacher.user.firstName,
                lastName: teacher.user.lastName,
                gender: teacher.user.gender,
                birthDate: teacher.user.birthDate,
                phone: teacher.user.phone,
                role: teacher.user.role,
                isActive: teacher.user.isActive,
                createdAt: teacher.user.createdAt,
                updatedAt: teacher.user.updatedAt,
            },
        };
    }
};
exports.TeacherService = TeacherService;
exports.TeacherService = TeacherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_entity_1.Teacher)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TeacherService);
//# sourceMappingURL=teacher.service.js.map