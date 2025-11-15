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
exports.GradeComplaintService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const grade_complaint_entity_1 = require("../../entities/grade-complaint.entity");
const grade_complaint_history_entity_1 = require("../../entities/grade-complaint-history.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const student_entity_1 = require("../../entities/student.entity");
const assessment_result_entity_1 = require("../../entities/assessment-result.entity");
let GradeComplaintService = class GradeComplaintService {
    gradeComplaintRepository;
    gradeComplaintHistoryRepository;
    assessmentRepository;
    studentRepository;
    assessmentResultRepository;
    constructor(gradeComplaintRepository, gradeComplaintHistoryRepository, assessmentRepository, studentRepository, assessmentResultRepository) {
        this.gradeComplaintRepository = gradeComplaintRepository;
        this.gradeComplaintHistoryRepository = gradeComplaintHistoryRepository;
        this.assessmentRepository = assessmentRepository;
        this.studentRepository = studentRepository;
        this.assessmentResultRepository = assessmentResultRepository;
    }
    async create(createGradeComplaintDto) {
        const { studentId, assessmentId, reason } = createGradeComplaintDto;
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
            relations: ['user'],
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const assessmentResult = await this.assessmentResultRepository.findOne({
            where: { studentId, assessmentId },
        });
        if (!assessmentResult) {
            throw new common_1.BadRequestException('Aucun résultat trouvé pour cet étudiant et cette évaluation');
        }
        const existingComplaint = await this.gradeComplaintRepository.findOne({
            where: { studentId, assessmentId },
        });
        if (existingComplaint) {
            throw new common_1.ConflictException('Une réclamation existe déjà pour cet étudiant et cette évaluation');
        }
        const gradeComplaint = this.gradeComplaintRepository.create({
            studentId,
            assessmentId,
            reason,
            status: grade_complaint_entity_1.ComplaintStatus.PENDING,
        });
        const savedComplaint = await this.gradeComplaintRepository.save(gradeComplaint);
        const complaintWithRelations = await this.gradeComplaintRepository.findOne({
            where: { id: savedComplaint.id },
            relations: ['student', 'student.user', 'assessment'],
        });
        if (!complaintWithRelations) {
            throw new common_1.NotFoundException('Réclamation créée mais non trouvée lors du rechargement');
        }
        return this.mapToGradeComplaintResponseDto(complaintWithRelations, assessmentResult.score);
    }
    async findAll() {
        const complaints = await this.gradeComplaintRepository.find({
            relations: ['student', 'student.user', 'assessment'],
            order: { createdAt: 'DESC' },
        });
        const complaintsWithScores = await Promise.all(complaints.map(async (complaint) => {
            const result = await this.assessmentResultRepository.findOne({
                where: {
                    studentId: complaint.studentId,
                    assessmentId: complaint.assessmentId,
                },
            });
            return this.mapToGradeComplaintResponseDto(complaint, result?.score || 0);
        }));
        return complaintsWithScores;
    }
    async findOne(id) {
        const complaint = await this.gradeComplaintRepository.findOne({
            where: { id },
            relations: ['student', 'student.user', 'assessment'],
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
        }
        const result = await this.assessmentResultRepository.findOne({
            where: {
                studentId: complaint.studentId,
                assessmentId: complaint.assessmentId,
            },
        });
        return this.mapToGradeComplaintResponseDto(complaint, result?.score || 0);
    }
    async findByStudent(studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Étudiant avec l'ID ${studentId} non trouvé`);
        }
        const complaints = await this.gradeComplaintRepository.find({
            where: { studentId },
            relations: ['student', 'student.user', 'assessment'],
            order: { createdAt: 'DESC' },
        });
        const complaintsWithScores = await Promise.all(complaints.map(async (complaint) => {
            const result = await this.assessmentResultRepository.findOne({
                where: {
                    studentId: complaint.studentId,
                    assessmentId: complaint.assessmentId,
                },
            });
            return this.mapToGradeComplaintResponseDto(complaint, result?.score || 0);
        }));
        return complaintsWithScores;
    }
    async findByAssessment(assessmentId) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const complaints = await this.gradeComplaintRepository.find({
            where: { assessmentId },
            relations: ['student', 'student.user', 'assessment'],
            order: { createdAt: 'DESC' },
        });
        const complaintsWithScores = await Promise.all(complaints.map(async (complaint) => {
            const result = await this.assessmentResultRepository.findOne({
                where: {
                    studentId: complaint.studentId,
                    assessmentId: complaint.assessmentId,
                },
            });
            return this.mapToGradeComplaintResponseDto(complaint, result?.score || 0);
        }));
        return complaintsWithScores;
    }
    async updateStatus(id, updateStatusDto, changedByUserId) {
        const complaint = await this.gradeComplaintRepository.findOne({
            where: { id },
            relations: ['assessment'],
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
        }
        if (complaint.status === grade_complaint_entity_1.ComplaintStatus.APPROVED ||
            complaint.status === grade_complaint_entity_1.ComplaintStatus.REJECTED) {
            throw new common_1.BadRequestException('Cette réclamation a déjà été traitée et ne peut plus être modifiée');
        }
        const { status, comment, newScore } = updateStatusDto;
        if (status === grade_complaint_entity_1.ComplaintStatus.APPROVED) {
            if (newScore === undefined) {
                throw new common_1.BadRequestException("Une nouvelle note doit être fournie lors de l'approbation");
            }
            if (newScore > complaint.assessment.maxScore) {
                throw new common_1.BadRequestException(`La nouvelle note (${newScore}) ne peut pas dépasser la note maximale de l'évaluation (${complaint.assessment.maxScore})`);
            }
            const currentResult = await this.assessmentResultRepository.findOne({
                where: {
                    studentId: complaint.studentId,
                    assessmentId: complaint.assessmentId,
                },
            });
            if (!currentResult) {
                throw new common_1.NotFoundException("Résultat d'évaluation non trouvé pour cette réclamation");
            }
            const oldScore = currentResult.score;
            currentResult.score = newScore;
            await this.assessmentResultRepository.save(currentResult);
            const historyEntry = this.gradeComplaintHistoryRepository.create({
                complaintId: id,
                oldScore,
                newScore,
                changedBy: changedByUserId,
                comment: comment || 'Réclamation approuvée',
            });
            await this.gradeComplaintHistoryRepository.save(historyEntry);
        }
        complaint.status = status;
        const updatedComplaint = await this.gradeComplaintRepository.save(complaint);
        const complaintWithRelations = await this.gradeComplaintRepository.findOne({
            where: { id: updatedComplaint.id },
            relations: ['student', 'student.user', 'assessment'],
        });
        if (!complaintWithRelations) {
            throw new common_1.NotFoundException('Réclamation mise à jour mais non trouvée lors du rechargement');
        }
        const result = await this.assessmentResultRepository.findOne({
            where: {
                studentId: complaintWithRelations.studentId,
                assessmentId: complaintWithRelations.assessmentId,
            },
        });
        return this.mapToGradeComplaintResponseDto(complaintWithRelations, result?.score || 0);
    }
    async getHistory(id) {
        const complaint = await this.gradeComplaintRepository.findOne({
            where: { id },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
        }
        const history = await this.gradeComplaintHistoryRepository.find({
            where: { complaintId: id },
            relations: ['changedByUser'],
            order: { changedAt: 'DESC' },
        });
        return history.map((entry) => ({
            id: entry.id,
            complaintId: entry.complaintId,
            oldScore: entry.oldScore,
            newScore: entry.newScore,
            changedBy: entry.changedBy,
            changedByName: entry.changedByUser
                ? `${entry.changedByUser.firstName} ${entry.changedByUser.lastName}`
                : '',
            changedAt: entry.changedAt,
            comment: entry.comment || '',
        }));
    }
    async remove(id) {
        const complaint = await this.gradeComplaintRepository.findOne({
            where: { id },
        });
        if (!complaint) {
            throw new common_1.NotFoundException(`Réclamation avec l'ID ${id} non trouvée`);
        }
        if (complaint.status === grade_complaint_entity_1.ComplaintStatus.APPROVED ||
            complaint.status === grade_complaint_entity_1.ComplaintStatus.REJECTED) {
            throw new common_1.ForbiddenException('Les réclamations traitées ne peuvent pas être supprimées');
        }
        await this.gradeComplaintRepository.remove(complaint);
    }
    mapToGradeComplaintResponseDto(complaint, currentScore) {
        return {
            id: complaint.id,
            studentId: complaint.studentId,
            studentName: complaint.student?.user
                ? `${complaint.student.user.firstName} ${complaint.student.user.lastName}`
                : '',
            studentMatricule: complaint.student?.matricule || '',
            assessmentId: complaint.assessmentId,
            assessmentTitle: complaint.assessment?.title || '',
            currentScore,
            maxScore: complaint.assessment?.maxScore || 0,
            status: complaint.status,
            reason: complaint.reason,
            createdAt: complaint.createdAt,
            updatedAt: complaint.updatedAt,
        };
    }
};
exports.GradeComplaintService = GradeComplaintService;
exports.GradeComplaintService = GradeComplaintService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(grade_complaint_entity_1.GradeComplaint)),
    __param(1, (0, typeorm_1.InjectRepository)(grade_complaint_history_entity_1.GradeComplaintHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(3, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(assessment_result_entity_1.AssessmentResult)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], GradeComplaintService);
//# sourceMappingURL=grade-complaint.service.js.map