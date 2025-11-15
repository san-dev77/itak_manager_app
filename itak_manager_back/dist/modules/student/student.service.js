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
exports.StudentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const student_entity_1 = require("../../entities/student.entity");
const user_entity_1 = require("../../entities/user.entity");
let StudentService = class StudentService {
    studentRepository;
    userRepository;
    constructor(studentRepository, userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }
    async createStudent(createStudentDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: createStudentDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            const existingStudent = await this.studentRepository.findOne({
                where: { matricule: createStudentDto.matricule },
            });
            if (existingStudent) {
                throw new common_1.ConflictException('Un étudiant avec ce matricule existe déjà');
            }
            const studentExists = await this.studentRepository.findOne({
                where: { userId: createStudentDto.userId },
            });
            if (studentExists) {
                throw new common_1.ConflictException('Cet utilisateur est déjà enregistré comme étudiant');
            }
            const student = this.studentRepository.create({
                ...createStudentDto,
                enrollmentDate: createStudentDto.enrollmentDate,
            });
            const savedStudent = await this.studentRepository.save(student);
            const studentWithUser = await this.studentRepository.findOne({
                where: { id: savedStudent.id },
                relations: ['user'],
            });
            if (!studentWithUser) {
                throw new Error("Erreur lors de la récupération de l'étudiant créé");
            }
            return this.mapToStudentResponseDto(studentWithUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'étudiant: ${message}`);
        }
    }
    async getAllStudents() {
        try {
            const students = await this.studentRepository.find({
                relations: ['user'],
                order: { createdAt: 'DESC' },
            });
            return students.map((student) => this.mapToStudentResponseDto(student));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des étudiants: ${message}`);
        }
    }
    async getStudentById(id) {
        try {
            const student = await this.studentRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponseDto(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${message}`);
        }
    }
    async getStudentByUserId(userId) {
        try {
            const student = await this.studentRepository.findOne({
                where: { userId },
                relations: ['user'],
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponseDto(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${message}`);
        }
    }
    async getStudentByMatricule(matricule) {
        try {
            const student = await this.studentRepository.findOne({
                where: { matricule },
                relations: ['user'],
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            return this.mapToStudentResponseDto(student);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'étudiant: ${message}`);
        }
    }
    async updateStudent(id, updateStudentDto) {
        try {
            await this.getStudentById(id);
            if (updateStudentDto.matricule) {
                const existingStudent = await this.studentRepository.findOne({
                    where: { matricule: updateStudentDto.matricule },
                });
                if (existingStudent && existingStudent.id !== id) {
                    throw new common_1.ConflictException('Un étudiant avec ce matricule existe déjà');
                }
            }
            const updateData = { ...updateStudentDto };
            if (updateStudentDto.enrollmentDate) {
                updateData.enrollmentDate = updateStudentDto.enrollmentDate;
            }
            await this.studentRepository.update(id, updateData);
            const updatedStudent = await this.studentRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!updatedStudent) {
                throw new common_1.NotFoundException('Étudiant non trouvé après mise à jour');
            }
            return this.mapToStudentResponseDto(updatedStudent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'étudiant: ${message}`);
        }
    }
    async deleteStudent(id) {
        try {
            await this.getStudentById(id);
            await this.studentRepository.delete(id);
            return { message: 'Étudiant supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'étudiant: ${message}`);
        }
    }
    mapToStudentResponseDto(student) {
        return {
            id: student.id,
            userId: student.userId,
            matricule: student.matricule,
            enrollmentDate: student.enrollmentDate,
            photo: student.photo,
            maritalStatus: student.maritalStatus,
            fatherName: student.fatherName,
            motherName: student.motherName,
            tutorName: student.tutorName,
            tutorPhone: student.tutorPhone,
            address: student.address,
            emergencyContact: student.emergencyContact,
            notes: student.notes,
            createdAt: student.createdAt,
            updatedAt: student.updatedAt,
            user: student.user
                ? {
                    id: student.user.id,
                    username: student.user.username,
                    email: student.user.email,
                    firstName: student.user.firstName,
                    lastName: student.user.lastName,
                    gender: student.user.gender,
                    birthDate: student.user.birthDate,
                    phone: student.user.phone,
                    role: student.user.role,
                    isActive: student.user.isActive,
                    createdAt: student.user.createdAt,
                    updatedAt: student.user.updatedAt,
                }
                : undefined,
        };
    }
};
exports.StudentService = StudentService;
exports.StudentService = StudentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StudentService);
//# sourceMappingURL=student.service.js.map