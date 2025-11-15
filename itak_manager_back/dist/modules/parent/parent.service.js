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
exports.ParentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const parent_entity_1 = require("../../entities/parent.entity");
const user_entity_1 = require("../../entities/user.entity");
const student_entity_1 = require("../../entities/student.entity");
const student_parent_entity_1 = require("../../entities/student-parent.entity");
let ParentService = class ParentService {
    parentRepository;
    userRepository;
    studentRepository;
    studentParentRepository;
    constructor(parentRepository, userRepository, studentRepository, studentParentRepository) {
        this.parentRepository = parentRepository;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.studentParentRepository = studentParentRepository;
    }
    async createParent(createParentDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: createParentDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            const parentExists = await this.parentRepository.findOne({
                where: { userId: createParentDto.userId },
            });
            if (parentExists) {
                throw new common_1.ConflictException('Cet utilisateur est déjà enregistré comme parent');
            }
            const parent = this.parentRepository.create({
                userId: createParentDto.userId,
                job: createParentDto.job,
            });
            const savedParent = await this.parentRepository.save(parent);
            const parentWithRelations = await this.parentRepository.findOne({
                where: { id: savedParent.id },
                relations: ['user'],
            });
            return this.mapToParentResponse(parentWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création du parent: ${message}`);
        }
    }
    async getAllParents() {
        try {
            const parents = await this.parentRepository.find({
                relations: ['user'],
                order: { createdAt: 'DESC' },
            });
            return parents.map((parent) => this.mapToParentResponse(parent));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des parents: ${message}`);
        }
    }
    async getParentById(id) {
        try {
            const parent = await this.parentRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent non trouvé');
            }
            return this.mapToParentResponse(parent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du parent: ${message}`);
        }
    }
    async updateParent(id, updateParentDto) {
        try {
            const parent = await this.parentRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent non trouvé');
            }
            Object.assign(parent, updateParentDto);
            const updatedParent = await this.parentRepository.save(parent);
            return this.mapToParentResponse(updatedParent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour du parent: ${message}`);
        }
    }
    async deleteParent(id) {
        try {
            const parent = await this.parentRepository.findOne({
                where: { id },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent non trouvé');
            }
            await this.parentRepository.remove(parent);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression du parent: ${message}`);
        }
    }
    async linkStudentToParent(createStudentParentDto) {
        try {
            const student = await this.studentRepository.findOne({
                where: { id: createStudentParentDto.studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            const parent = await this.parentRepository.findOne({
                where: { id: createStudentParentDto.parentId },
            });
            if (!parent) {
                throw new common_1.NotFoundException('Parent non trouvé');
            }
            const existingRelation = await this.studentParentRepository.findOne({
                where: {
                    studentId: createStudentParentDto.studentId,
                    parentId: createStudentParentDto.parentId,
                },
            });
            if (existingRelation) {
                throw new common_1.ConflictException('Cette relation parent-étudiant existe déjà');
            }
            const studentParent = this.studentParentRepository.create({
                studentId: createStudentParentDto.studentId,
                parentId: createStudentParentDto.parentId,
                relationship: createStudentParentDto.relationship,
            });
            const savedRelation = await this.studentParentRepository.save(studentParent);
            return this.mapToStudentParentResponse(savedRelation);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de la relation parent-étudiant: ${message}`);
        }
    }
    async getStudentParents(studentId) {
        try {
            const relations = await this.studentParentRepository.find({
                where: { studentId },
                relations: ['parent', 'parent.user', 'student', 'student.user'],
            });
            return relations.map((relation) => this.mapToStudentParentResponse(relation));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des parents de l'étudiant: ${message}`);
        }
    }
    mapToParentResponse(parent) {
        return {
            id: parent.id,
            job: parent.job,
            createdAt: parent.createdAt,
            updatedAt: parent.updatedAt,
            user: parent.user
                ? {
                    id: parent.user.id,
                    username: parent.user.username,
                    email: parent.user.email,
                    firstName: parent.user.firstName,
                    lastName: parent.user.lastName,
                    gender: parent.user.gender,
                    birthDate: parent.user.birthDate,
                    phone: parent.user.phone,
                    role: parent.user.role,
                    isActive: parent.user.isActive,
                    createdAt: parent.user.createdAt,
                    updatedAt: parent.user.updatedAt,
                }
                : undefined,
        };
    }
    mapToStudentParentResponse(studentParent) {
        return {
            id: studentParent.id,
            studentId: studentParent.studentId,
            parentId: studentParent.parentId,
            relationship: studentParent.relationship,
            createdAt: studentParent.createdAt,
            updatedAt: studentParent.updatedAt,
        };
    }
};
exports.ParentService = ParentService;
exports.ParentService = ParentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(parent_entity_1.Parent)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(student_parent_entity_1.StudentParent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ParentService);
//# sourceMappingURL=parent.service.js.map