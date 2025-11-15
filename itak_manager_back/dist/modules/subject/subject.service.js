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
exports.SubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subject_entity_1 = require("../../entities/subject.entity");
let SubjectService = class SubjectService {
    subjectRepository;
    constructor(subjectRepository) {
        this.subjectRepository = subjectRepository;
    }
    async createSubject(createSubjectDto) {
        try {
            const existingSubject = await this.subjectRepository.findOne({
                where: { code: createSubjectDto.code },
            });
            if (existingSubject) {
                throw new common_1.ConflictException('Une matière avec ce code existe déjà');
            }
            const existingSubjectName = await this.subjectRepository.findOne({
                where: { name: createSubjectDto.name },
            });
            if (existingSubjectName) {
                throw new common_1.ConflictException('Une matière avec ce nom existe déjà');
            }
            const subject = this.subjectRepository.create(createSubjectDto);
            const savedSubject = await this.subjectRepository.save(subject);
            return this.mapToSubjectResponseDto(savedSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de la matière: ${message}`);
        }
    }
    async getAllSubjects() {
        try {
            const subjects = await this.subjectRepository.find({
                order: { createdAt: 'DESC' },
            });
            return subjects.map((subject) => this.mapToSubjectResponseDto(subject));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des matières: ${message}`);
        }
    }
    async getSubjectById(id) {
        try {
            const subject = await this.subjectRepository.findOne({
                where: { id },
            });
            if (!subject) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            return this.mapToSubjectResponseDto(subject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la matière: ${message}`);
        }
    }
    async getSubjectByCode(code) {
        try {
            const subject = await this.subjectRepository.findOne({
                where: { code },
            });
            if (!subject) {
                throw new common_1.NotFoundException('Matière non trouvée');
            }
            return this.mapToSubjectResponseDto(subject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la matière: ${message}`);
        }
    }
    async getSubjectsByName(name) {
        try {
            const subjects = await this.subjectRepository.find({
                where: { name: name },
                order: { name: 'ASC' },
            });
            return subjects.map((subject) => this.mapToSubjectResponseDto(subject));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des matières: ${message}`);
        }
    }
    async updateSubject(id, updateSubjectDto) {
        try {
            await this.getSubjectById(id);
            if (updateSubjectDto.code) {
                const existingSubject = await this.subjectRepository.findOne({
                    where: { code: updateSubjectDto.code },
                });
                if (existingSubject && existingSubject.id !== id) {
                    throw new common_1.ConflictException('Une matière avec ce code existe déjà');
                }
            }
            if (updateSubjectDto.name) {
                const existingSubjectName = await this.subjectRepository.findOne({
                    where: { name: updateSubjectDto.name },
                });
                if (existingSubjectName && existingSubjectName.id !== id) {
                    throw new common_1.ConflictException('Une matière avec ce nom existe déjà');
                }
            }
            await this.subjectRepository.update(id, updateSubjectDto);
            const updatedSubject = await this.subjectRepository.findOne({
                where: { id },
            });
            if (!updatedSubject) {
                throw new common_1.NotFoundException('Matière non trouvée après mise à jour');
            }
            return this.mapToSubjectResponseDto(updatedSubject);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de la matière: ${message}`);
        }
    }
    async deleteSubject(id) {
        try {
            await this.getSubjectById(id);
            await this.subjectRepository.delete(id);
            return { message: 'Matière supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de la matière: ${message}`);
        }
    }
    mapToSubjectResponseDto(subject) {
        return {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
        };
    }
};
exports.SubjectService = SubjectService;
exports.SubjectService = SubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subject_entity_1.Subject)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SubjectService);
//# sourceMappingURL=subject.service.js.map