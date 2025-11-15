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
exports.AssessmentSubjectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const assessment_subject_entity_1 = require("../../entities/assessment-subject.entity");
const assessment_entity_1 = require("../../entities/assessment.entity");
const user_entity_1 = require("../../entities/user.entity");
const file_upload_service_1 = require("../../services/file-upload.service");
let AssessmentSubjectService = class AssessmentSubjectService {
    assessmentSubjectRepository;
    assessmentRepository;
    userRepository;
    fileUploadService;
    constructor(assessmentSubjectRepository, assessmentRepository, userRepository, fileUploadService) {
        this.assessmentSubjectRepository = assessmentSubjectRepository;
        this.assessmentRepository = assessmentRepository;
        this.userRepository = userRepository;
        this.fileUploadService = fileUploadService;
    }
    async create(createDto, file, uploadedByUserId) {
        const { assessmentId, fileType } = createDto;
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const user = await this.userRepository.findOne({
            where: { id: uploadedByUserId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${uploadedByUserId} non trouvé`);
        }
        const detectedFileType = this.fileUploadService.getFileTypeFromMimeType(file.mimetype);
        if (detectedFileType !== fileType) {
            throw new common_1.BadRequestException(`Le type de fichier déclaré (${fileType}) ne correspond pas au fichier uploadé (${detectedFileType})`);
        }
        if (!this.fileUploadService.isDocumentFile(file.mimetype)) {
            throw new common_1.BadRequestException("Seuls les documents (PDF, DOC, DOCX, ODT) sont autorisés pour les sujets d'évaluation");
        }
        const uploadedFile = await this.fileUploadService.uploadFile(file, 'assessment-subjects');
        const assessmentSubject = this.assessmentSubjectRepository.create({
            assessmentId,
            fileUrl: uploadedFile.url,
            fileType,
            uploadedBy: uploadedByUserId,
        });
        const savedSubject = await this.assessmentSubjectRepository.save(assessmentSubject);
        const subjectWithRelations = await this.assessmentSubjectRepository.findOne({
            where: { id: savedSubject.id },
            relations: ['assessment', 'uploadedByUser'],
        });
        if (!subjectWithRelations) {
            throw new common_1.NotFoundException('Sujet créé mais non trouvé lors du rechargement');
        }
        return this.mapToAssessmentSubjectResponseDto(subjectWithRelations, uploadedFile);
    }
    async findAll() {
        const subjects = await this.assessmentSubjectRepository.find({
            relations: ['assessment', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
        return subjects.map((subject) => this.mapToAssessmentSubjectResponseDto(subject));
    }
    async findOne(id) {
        const subject = await this.assessmentSubjectRepository.findOne({
            where: { id },
            relations: ['assessment', 'uploadedByUser'],
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
        }
        return this.mapToAssessmentSubjectResponseDto(subject);
    }
    async findByAssessment(assessmentId) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id: assessmentId },
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Évaluation avec l'ID ${assessmentId} non trouvée`);
        }
        const subjects = await this.assessmentSubjectRepository.find({
            where: { assessmentId },
            relations: ['assessment', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
        return subjects.map((subject) => this.mapToAssessmentSubjectResponseDto(subject));
    }
    async findByUser(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
        }
        const subjects = await this.assessmentSubjectRepository.find({
            where: { uploadedBy: userId },
            relations: ['assessment', 'uploadedByUser'],
            order: { createdAt: 'DESC' },
        });
        return subjects.map((subject) => this.mapToAssessmentSubjectResponseDto(subject));
    }
    async update(id, updateDto, file, userId) {
        const subject = await this.assessmentSubjectRepository.findOne({
            where: { id },
            relations: ['uploadedByUser'],
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
        }
        if (userId && subject.uploadedBy !== userId) {
            throw new common_1.ForbiddenException("Seul l'utilisateur qui a uploadé le fichier peut le modifier");
        }
        let uploadedFile;
        if (file) {
            if (updateDto.fileType) {
                const detectedFileType = this.fileUploadService.getFileTypeFromMimeType(file.mimetype);
                if (detectedFileType !== updateDto.fileType) {
                    throw new common_1.BadRequestException(`Le type de fichier déclaré (${updateDto.fileType}) ne correspond pas au fichier uploadé (${detectedFileType})`);
                }
            }
            if (!this.fileUploadService.isDocumentFile(file.mimetype)) {
                throw new common_1.BadRequestException("Seuls les documents (PDF, DOC, DOCX, ODT) sont autorisés pour les sujets d'évaluation");
            }
            const oldFilePath = subject.fileUrl.replace(process.env.BASE_URL || 'http://localhost:3000', process.cwd());
            await this.fileUploadService.deleteFile(oldFilePath);
            uploadedFile = await this.fileUploadService.uploadFile(file, 'assessment-subjects');
            subject.fileUrl = uploadedFile.url;
            subject.fileType =
                updateDto.fileType ||
                    this.fileUploadService.getFileTypeFromMimeType(file.mimetype);
        }
        else if (updateDto.fileType) {
            subject.fileType = updateDto.fileType;
        }
        const updatedSubject = await this.assessmentSubjectRepository.save(subject);
        const subjectWithRelations = await this.assessmentSubjectRepository.findOne({
            where: { id: updatedSubject.id },
            relations: ['assessment', 'uploadedByUser'],
        });
        if (!subjectWithRelations) {
            throw new common_1.NotFoundException('Sujet mis à jour mais non trouvé lors du rechargement');
        }
        return this.mapToAssessmentSubjectResponseDto(subjectWithRelations, uploadedFile);
    }
    async remove(id, userId) {
        const subject = await this.assessmentSubjectRepository.findOne({
            where: { id },
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
        }
        if (userId && subject.uploadedBy !== userId) {
            throw new common_1.ForbiddenException("Seul l'utilisateur qui a uploadé le fichier peut le supprimer");
        }
        const filePath = subject.fileUrl.replace(process.env.BASE_URL || 'http://localhost:3000', process.cwd());
        await this.fileUploadService.deleteFile(filePath);
        await this.assessmentSubjectRepository.remove(subject);
    }
    mapToAssessmentSubjectResponseDto(subject, uploadedFile) {
        return {
            id: subject.id,
            assessmentId: subject.assessmentId,
            assessmentTitle: subject.assessment?.title || '',
            fileUrl: subject.fileUrl,
            fileType: subject.fileType,
            uploadedBy: subject.uploadedBy,
            uploadedByName: subject.uploadedByUser
                ? `${subject.uploadedByUser.firstName} ${subject.uploadedByUser.lastName}`
                : '',
            originalFileName: uploadedFile?.originalName || 'Fichier',
            fileSize: uploadedFile?.size || 0,
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt,
        };
    }
};
exports.AssessmentSubjectService = AssessmentSubjectService;
exports.AssessmentSubjectService = AssessmentSubjectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_subject_entity_1.AssessmentSubject)),
    __param(1, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        file_upload_service_1.FileUploadService])
], AssessmentSubjectService);
//# sourceMappingURL=assessment-subject.service.js.map