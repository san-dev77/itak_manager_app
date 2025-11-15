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
exports.ClassSubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
const class_entity_1 = require("../../entities/class.entity");
const subject_entity_1 = require("../../entities/subject.entity");
let ClassSubjectService = class ClassSubjectService {
    classSubjectRepository;
    classRepository;
    subjectRepository;
    constructor(classSubjectRepository, classRepository, subjectRepository) {
        this.classSubjectRepository = classSubjectRepository;
        this.classRepository = classRepository;
        this.subjectRepository = subjectRepository;
    }
    async createClassSubject(createClassSubjectDto) {
        try {
            const classEntity = await this.classRepository.findOne({
                where: { id: createClassSubjectDto.classId },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            const subjectEntity = await this.subjectRepository.findOne({
                where: { id: createClassSubjectDto.subjectId },
            });
            if (!subjectEntity) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            const existingClassSubject = await this.classSubjectRepository.findOne({
                where: {
                    classId: createClassSubjectDto.classId,
                    subjectId: createClassSubjectDto.subjectId,
                },
            });
            if (existingClassSubject) {
                throw new common_1.ConflictException('Cette matière est déjà associée à cette classe');
            }
            const classSubject = this.classSubjectRepository.create(createClassSubjectDto);
            const savedClassSubject = await this.classSubjectRepository.save(classSubject);
            const classSubjectWithRelations = await this.classSubjectRepository.findOne({
                where: { id: savedClassSubject.id },
                relations: ['class', 'subject'],
            });
            if (!classSubjectWithRelations) {
                throw new Error("Erreur lors de la récupération de l'association créée");
            }
            return this.mapToClassSubject(classSubjectWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'association classe-matière: ${message}`);
        }
    }
    async getAllClassSubjects() {
        try {
            const classSubjects = await this.classSubjectRepository.find({
                relations: ['class', 'subject'],
                order: { createdAt: 'DESC' },
            });
            return classSubjects.map((classSubject) => this.mapToClassSubject(classSubject));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des associations classe-matière: ${message}`);
        }
    }
    async getClassSubjectById(id) {
        try {
            const classSubject = await this.classSubjectRepository.findOne({
                where: { id },
                relations: ['class', 'subject'],
            });
            if (!classSubject) {
                throw new common_1.NotFoundException('Association classe-matière non trouvée');
            }
            return this.mapToClassSubject(classSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'association classe-matière: ${message}`);
        }
    }
    async getClassSubjectsByClass(classId) {
        try {
            const classSubjects = await this.classSubjectRepository.find({
                where: { classId },
                relations: ['class', 'subject'],
                order: { createdAt: 'DESC' },
            });
            return classSubjects.map((classSubject) => this.mapToClassSubject(classSubject));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des matières de la classe: ${message}`);
        }
    }
    async getClassSubjectsBySubject(subjectId) {
        try {
            const classSubjects = await this.classSubjectRepository.find({
                where: { subjectId },
                relations: ['class', 'subject'],
                order: { createdAt: 'DESC' },
            });
            return classSubjects.map((classSubject) => this.mapToClassSubject(classSubject));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes pour la matière: ${message}`);
        }
    }
    async updateClassSubject(id, updateClassSubjectDto) {
        try {
            await this.getClassSubjectById(id);
            if (updateClassSubjectDto.classId) {
                const classEntity = await this.classRepository.findOne({
                    where: { id: updateClassSubjectDto.classId },
                });
                if (!classEntity) {
                    throw new common_1.NotFoundException('Classe non trouvée');
                }
            }
            if (updateClassSubjectDto.subjectId) {
                const subjectEntity = await this.subjectRepository.findOne({
                    where: { id: updateClassSubjectDto.subjectId },
                });
                if (!subjectEntity) {
                    throw new common_1.NotFoundException('Matière non trouvée');
                }
            }
            if (updateClassSubjectDto.classId || updateClassSubjectDto.subjectId) {
                const currentClassSubject = await this.classSubjectRepository.findOne({
                    where: { id },
                });
                const newClassId = updateClassSubjectDto.classId || currentClassSubject?.classId;
                const newSubjectId = updateClassSubjectDto.subjectId || currentClassSubject?.subjectId;
                const existingClassSubject = await this.classSubjectRepository.findOne({
                    where: {
                        classId: newClassId,
                        subjectId: newSubjectId,
                    },
                });
                if (existingClassSubject && existingClassSubject.id !== id) {
                    throw new common_1.ConflictException('Cette matière est déjà associée à cette classe');
                }
            }
            await this.classSubjectRepository.update(id, updateClassSubjectDto);
            const updatedClassSubject = await this.classSubjectRepository.findOne({
                where: { id },
                relations: ['class', 'subject'],
            });
            if (!updatedClassSubject) {
                throw new common_1.NotFoundException('Association classe-matière non trouvée après mise à jour');
            }
            return this.mapToClassSubject(updatedClassSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'association classe-matière: ${message}`);
        }
    }
    async deleteClassSubject(id) {
        try {
            await this.getClassSubjectById(id);
            await this.classSubjectRepository.delete(id);
            return { message: 'Association classe-matière supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'association classe-matière: ${message}`);
        }
    }
    mapToClassSubject(classSubject) {
        return {
            id: classSubject.id,
            classId: classSubject.classId,
            subjectId: classSubject.subjectId,
            coefficient: classSubject.coefficient,
            weeklyHours: classSubject.weeklyHours,
            isOptional: classSubject.isOptional,
            createdAt: classSubject.createdAt,
            updatedAt: classSubject.updatedAt,
            class: {
                id: classSubject.class.id,
                name: classSubject.class.name,
                code: classSubject.class.code,
                description: classSubject.class.description,
            },
            subject: {
                id: classSubject.subject.id,
                name: classSubject.subject.name,
                code: classSubject.subject.code,
            },
        };
    }
};
exports.ClassSubjectService = ClassSubjectService;
exports.ClassSubjectService = ClassSubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_subject_entity_1.ClassSubject)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ClassSubjectService);
//# sourceMappingURL=class-subject.service.js.map