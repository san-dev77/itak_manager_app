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
exports.AssessmentResultService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_result_entity_1 = require("../../entities/assessment-result.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
let AssessmentResultService = class AssessmentResultService {
    assessmentResultRepository;
    assessmentRepository;
    studentRepository;
    constructor(assessmentResultRepository, assessmentRepository, studentRepository) {
        this.assessmentResultRepository = assessmentResultRepository;
        this.assessmentRepository = assessmentRepository;
        this.studentRepository = studentRepository;
    }
    async create(createAssessmentResultDto) {
        const { assessmentId, studentId, score, ...resultData } = createAssessmentResultDto;
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
            relations: ['user'],
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        if (score > assessment.maxScore) {
            throw new common_1.BadRequestException(`La note (${score}) ne peut pas dépasser la note maximale de l'évaluation (${assessment.maxScore})`);
        }
        const existingResult = await this.assessmentResultRepository.findOne({
            where: { assessmentId, studentId },
        });
        if (existingResult) {
            throw new common_1.ConflictException('Un résultat existe déjà pour cet étudiant et cette évaluation');
        }
        const assessmentResult = this.assessmentResultRepository.create({
            ...resultData,
            assessmentId,
            studentId,
            score,
        });
        const savedResult = await this.assessmentResultRepository.save(assessmentResult);
        const resultWithRelations = await this.assessmentResultRepository.findOne({
            where: { id: savedResult.id },
            relations: ['assessment', 'student', 'student.user'],
        });
        if (!resultWithRelations) {
            throw new common_1.NotFoundException('Résultat créé mais non trouvé lors du rechargement');
        }
        return this.mapToAssessmentResultResponseDto(resultWithRelations);
    }
    async bulkCreate(bulkCreateDto) {
        const { assessmentId, results } = bulkCreateDto;
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const createdResults = [];
        for (const resultData of results) {
            try {
                const result = await this.create({
                    ...resultData,
                    assessmentId,
                });
                createdResults.push(result);
            }
            catch (error) {
                console.error(`Erreur lors de la création du résultat pour l'étudiant ${resultData.studentId}:`, error);
            }
        }
        return createdResults;
    }
    async findAll() {
        const results = await this.assessmentResultRepository.find({
            relations: ['assessment', 'student', 'student.user'],
            order: { createdAt: 'DESC' },
        });
        return results.map((result) => this.mapToAssessmentResultResponseDto(result));
    }
    async findOne(id) {
        const result = await this.assessmentResultRepository.findOne({
            where: { id },
            relations: ['assessment', 'student', 'student.user'],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
        }
        return this.mapToAssessmentResultResponseDto(result);
    }
    async findByAssessment(assessmentId) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const results = await this.assessmentResultRepository.find({
            where: { assessmentId },
            relations: ['assessment', 'student', 'student.user'],
            order: { score: 'DESC' },
        });
        return results.map((result) => this.mapToAssessmentResultResponseDto(result));
    }
    async findByStudent(studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        const results = await this.assessmentResultRepository.find({
            where: { studentId },
            relations: ['assessment', 'student', 'student.user'],
            order: { createdAt: 'DESC' },
        });
        return results.map((result) => this.mapToAssessmentResultResponseDto(result));
    }
    async update(id, updateAssessmentResultDto) {
        const result = await this.assessmentResultRepository.findOne({
            where: { id },
            relations: ['assessment'],
        });
        if (!result) {
            throw new common_1.NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
        }
        if (updateAssessmentResultDto.score !== undefined) {
            if (updateAssessmentResultDto.score > result.assessment.maxScore) {
                throw new common_1.BadRequestException(`La note (${updateAssessmentResultDto.score}) ne peut pas dépasser la note maximale de l'évaluation (${result.assessment.maxScore})`);
            }
        }
        Object.assign(result, updateAssessmentResultDto);
        const updatedResult = await this.assessmentResultRepository.save(result);
        const resultWithRelations = await this.assessmentResultRepository.findOne({
            where: { id: updatedResult.id },
            relations: ['assessment', 'student', 'student.user'],
        });
        if (!resultWithRelations) {
            throw new common_1.NotFoundException('Résultat mis à jour mais non trouvé lors du rechargement');
        }
        return this.mapToAssessmentResultResponseDto(resultWithRelations);
    }
    async remove(id) {
        const result = await this.assessmentResultRepository.findOne({
            where: { id },
        });
        if (!result) {
            throw new common_1.NotFoundException(`Résultat avec l'ID ${id} non trouvé`);
        }
        await this.assessmentResultRepository.remove(result);
    }
    mapToAssessmentResultResponseDto(result) {
        const percentage = (result.score / result.assessment.maxScore) * 100;
        return {
            id: result.id,
            assessmentId: result.assessmentId,
            assessmentTitle: result.assessment?.title || '',
            assessmentMaxScore: result.assessment?.maxScore || 0,
            studentId: result.studentId,
            studentName: result.student?.user
                ? `${result.student.user.firstName} ${result.student.user.lastName}`
                : '',
            studentMatricule: result.student?.matricule || '',
            score: result.score,
            percentage: Math.round(percentage * 100) / 100,
            remarks: result.remarks || '',
            status: result.status,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt,
        };
    }
};
exports.AssessmentResultService = AssessmentResultService;
exports.AssessmentResultService = AssessmentResultService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_result_entity_1.AssessmentResult)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssessmentResultService);
//# sourceMappingURL=assessment-result.service.js.map