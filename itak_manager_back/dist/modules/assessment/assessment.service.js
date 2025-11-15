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
exports.AssessmentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_entity_1 = require("../../entities/assessment.entity");
const term_entity_1 = require("../../entities/term.entity");
const class_subject_entity_1 = require("../../entities/class-subject.entity");
let AssessmentService = class AssessmentService {
    assessmentRepository;
    termRepository;
    classSubjectRepository;
    constructor(assessmentRepository, termRepository, classSubjectRepository) {
        this.assessmentRepository = assessmentRepository;
        this.termRepository = termRepository;
        this.classSubjectRepository = classSubjectRepository;
    }
    async create(createAssessmentDto) {
        const { termId, classSubjectId, startDate, endDate, ...assessmentData } = createAssessmentDto;
        const term = await this.termRepository.findOne({
            where: { id: termId },
            relations: ['schoolYear'],
        });
        if (!term) {
            throw new common_1.NotFoundException(`Trimestre avec l'ID ${termId} non trouvé`);
        }
        if (!term.isActive) {
            throw new common_1.BadRequestException('Le trimestre doit être actif pour créer une évaluation');
        }
        const classSubject = await this.classSubjectRepository.findOne({
            where: { id: classSubjectId },
            relations: ['class', 'subject'],
        });
        if (!classSubject) {
            throw new common_1.NotFoundException(`Matière de classe avec l'ID ${classSubjectId} non trouvée`);
        }
        const assessmentStartDate = new Date(startDate);
        const assessmentEndDate = new Date(endDate);
        const termStartDate = new Date(term.startDate);
        const termEndDate = new Date(term.endDate);
        if (assessmentStartDate >= assessmentEndDate) {
            throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
        }
        if (assessmentStartDate < termStartDate ||
            assessmentEndDate > termEndDate) {
            throw new common_1.BadRequestException(`La période d'évaluation doit être comprise entre ${term.startDate.toISOString()} et ${term.endDate.toISOString()}`);
        }
        const existingAssessment = await this.assessmentRepository.findOne({
            where: {
                title: assessmentData.title,
                classSubjectId,
                startDate: assessmentStartDate,
                endDate: assessmentEndDate,
            },
        });
        if (existingAssessment) {
            throw new common_1.ConflictException('Une évaluation avec le même titre existe déjà pour cette matière à cette période');
        }
        const assessment = this.assessmentRepository.create({
            ...assessmentData,
            termId,
            classSubjectId,
            startDate: assessmentStartDate,
            endDate: assessmentEndDate,
        });
        const savedAssessment = await this.assessmentRepository.save(assessment);
        const assessmentWithRelations = await this.assessmentRepository.findOne({
            where: { id: savedAssessment.id },
            relations: [
                'term',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
        });
        if (!assessmentWithRelations) {
            throw new common_1.NotFoundException('Évaluation créée mais non trouvée lors du rechargement');
        }
        return this.mapToAssessmentResponseDto(assessmentWithRelations);
    }
    async findAll() {
        const assessments = await this.assessmentRepository.find({
            relations: [
                'term',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
            order: { startDate: 'DESC', createdAt: 'DESC' },
        });
        return assessments.map((assessment) => this.mapToAssessmentResponseDto(assessment));
    }
    async findOne(id) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id },
            relations: [
                'term',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
        }
        return this.mapToAssessmentResponseDto(assessment);
    }
    async findByTerm(termId) {
        const term = await this.termRepository.findOne({ where: { id: termId } });
        if (!term) {
            throw new common_1.NotFoundException(`Trimestre avec l'ID ${termId} non trouvé`);
        }
        const assessments = await this.assessmentRepository.find({
            where: { termId },
            relations: [
                'term',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
            order: { startDate: 'ASC', createdAt: 'ASC' },
        });
        return assessments.map((assessment) => this.mapToAssessmentResponseDto(assessment));
    }
    async findByClassSubject(classSubjectId) {
        const classSubject = await this.classSubjectRepository.findOne({
            where: { id: classSubjectId },
        });
        if (!classSubject) {
            throw new common_1.NotFoundException(`Matière de classe avec l'ID ${classSubjectId} non trouvée`);
        }
        const assessments = await this.assessmentRepository.find({
            where: { classSubjectId },
            relations: [
                'term',
                'classSubject',
                'classSubject.class',
                'classSubject.subject',
            ],
            order: { startDate: 'DESC', createdAt: 'DESC' },
        });
        return assessments.map((assessment) => this.mapToAssessmentResponseDto(assessment));
    }
    async findByClass(classId) {
        const assessments = await this.assessmentRepository
            .createQueryBuilder('assessment')
            .leftJoinAndSelect('assessment.term', 'term')
            .leftJoinAndSelect('assessment.classSubject', 'classSubject')
            .leftJoinAndSelect('classSubject.class', 'class')
            .leftJoinAndSelect('classSubject.subject', 'subject')
            .where('class.id = :classId', { classId })
            .orderBy('assessment.date', 'DESC')
            .addOrderBy('assessment.createdAt', 'DESC')
            .getMany();
        return assessments.map((assessment) => this.mapToAssessmentResponseDto(assessment));
    }
    async update(id, updateAssessmentDto) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id },
            relations: ['term', 'classSubject'],
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
        }
        if (updateAssessmentDto.startDate || updateAssessmentDto.endDate) {
            const newDate = new Date(updateAssessmentDto.startDate);
            const termStartDate = new Date(assessment.term.startDate);
            const termEndDate = new Date(assessment.term.endDate);
            if (newDate < termStartDate || newDate > termEndDate) {
                throw new common_1.BadRequestException(`La date de l'évaluation doit être comprise entre ${assessment.term.startDate.toISOString()} et ${assessment.term.endDate.toISOString()}`);
            }
        }
        if (updateAssessmentDto.title ||
            updateAssessmentDto.startDate ||
            updateAssessmentDto.endDate) {
            const title = updateAssessmentDto.title || assessment.title;
            const startDate = updateAssessmentDto.startDate
                ? new Date(updateAssessmentDto.startDate)
                : assessment.startDate;
            const endDate = updateAssessmentDto.endDate
                ? new Date(updateAssessmentDto.endDate)
                : assessment.endDate;
            const existingAssessment = await this.assessmentRepository.findOne({
                where: {
                    title,
                    classSubjectId: assessment.classSubjectId,
                    startDate,
                    endDate,
                },
            });
            if (existingAssessment && existingAssessment.id !== id) {
                throw new common_1.ConflictException('Une évaluation avec le même titre existe déjà pour cette matière à cette date');
            }
        }
        Object.assign(assessment, updateAssessmentDto);
        if (updateAssessmentDto.startDate) {
            assessment.startDate = new Date(updateAssessmentDto.startDate);
        }
        if (updateAssessmentDto.endDate) {
            assessment.endDate = new Date(updateAssessmentDto.endDate);
        }
        const updatedAssessment = await this.assessmentRepository.save(assessment);
        return this.mapToAssessmentResponseDto(updatedAssessment);
    }
    async remove(id) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${id} non trouvée`);
        }
        await this.assessmentRepository.remove(assessment);
    }
    mapToAssessmentResponseDto(assessment) {
        return {
            id: assessment.id,
            termId: assessment.termId,
            termName: assessment.term?.name || '',
            classSubjectId: assessment.classSubjectId,
            className: assessment.classSubject?.class?.name || '',
            subjectName: assessment.classSubject?.subject?.name || '',
            type: assessment.type,
            title: assessment.title,
            description: assessment.description || '',
            startDate: assessment.startDate,
            endDate: assessment.endDate,
            maxScore: assessment.maxScore,
            weight: assessment.weight,
            createdAt: assessment.createdAt,
            updatedAt: assessment.updatedAt,
        };
    }
};
exports.AssessmentService = AssessmentService;
exports.AssessmentService = AssessmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(1, (0, typeorm_1.InjectRepository)(term_entity_1.Term)),
    __param(2, (0, typeorm_1.InjectRepository)(class_subject_entity_1.ClassSubject)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssessmentService);
//# sourceMappingURL=assessment.service.js.map