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
exports.TermService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const term_entity_1 = require("../../entities/term.entity");
const school_year_entity_1 = require("../../entities/school-year.entity");
let TermService = class TermService {
    termRepository;
    schoolYearRepository;
    constructor(termRepository, schoolYearRepository) {
        this.termRepository = termRepository;
        this.schoolYearRepository = schoolYearRepository;
    }
    async createTerm(createTermDto) {
        try {
            const schoolYear = await this.schoolYearRepository.findOne({
                where: { id: createTermDto.schoolYearId },
            });
            if (!schoolYear) {
                throw new common_1.NotFoundException('Année scolaire non trouvée');
            }
            const startDate = new Date(createTermDto.startDate);
            const endDate = new Date(createTermDto.endDate);
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
            }
            if (startDate < schoolYear.startDate || endDate > schoolYear.endDate) {
                throw new common_1.BadRequestException("Les dates du trimestre doivent être comprises dans la période de l'année scolaire");
            }
            const existingTerm = await this.termRepository.findOne({
                where: {
                    schoolYearId: createTermDto.schoolYearId,
                    name: createTermDto.name,
                },
            });
            if (existingTerm) {
                throw new common_1.ConflictException('Un trimestre avec ce nom existe déjà dans cette année scolaire');
            }
            let orderNumber = createTermDto.orderNumber;
            if (!orderNumber) {
                const lastTerm = await this.termRepository.findOne({
                    where: { schoolYearId: createTermDto.schoolYearId },
                    order: { orderNumber: 'DESC' },
                });
                orderNumber = lastTerm ? lastTerm.orderNumber + 1 : 1;
            }
            if (createTermDto.isActive) {
                await this.termRepository.update({ schoolYearId: createTermDto.schoolYearId }, { isActive: false });
            }
            const term = this.termRepository.create({
                schoolYearId: createTermDto.schoolYearId,
                name: createTermDto.name,
                startDate: startDate,
                endDate: endDate,
                isActive: createTermDto.isActive || false,
                orderNumber: orderNumber,
            });
            const savedTerm = await this.termRepository.save(term);
            return this.mapToTermResponseDto(savedTerm);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création du trimestre: ${message}`);
        }
    }
    async getAllTerms() {
        try {
            const terms = await this.termRepository.find({
                relations: ['schoolYear'],
                order: { orderNumber: 'ASC' },
            });
            return terms.map((term) => this.mapToTermResponseDto(term));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des trimestres: ${message}`);
        }
    }
    async getTermById(id) {
        try {
            const term = await this.termRepository.findOne({
                where: { id },
                relations: ['schoolYear'],
            });
            if (!term) {
                throw new common_1.NotFoundException('Trimestre non trouvé');
            }
            return this.mapToTermResponseDto(term);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du trimestre: ${message}`);
        }
    }
    async getTermsBySchoolYear(schoolYearId) {
        try {
            const terms = await this.termRepository.find({
                where: { schoolYearId },
                relations: ['schoolYear'],
                order: { orderNumber: 'ASC' },
            });
            return terms.map((term) => this.mapToTermResponseDto(term));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des trimestres: ${message}`);
        }
    }
    async getActiveTerm() {
        try {
            const activeTerm = await this.termRepository.findOne({
                where: { isActive: true },
                relations: ['schoolYear'],
            });
            if (!activeTerm) {
                throw new common_1.NotFoundException('Aucun trimestre actif trouvé');
            }
            return this.mapToTermResponseDto(activeTerm);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du trimestre actif: ${message}`);
        }
    }
    async updateTerm(id, updateTermDto) {
        try {
            const term = await this.termRepository.findOne({
                where: { id },
                relations: ['schoolYear'],
            });
            if (!term) {
                throw new common_1.NotFoundException('Trimestre non trouvé');
            }
            let schoolYear = term.schoolYear;
            const finalSchoolYearId = updateTermDto.schoolYearId || term.schoolYearId;
            if (updateTermDto.schoolYearId &&
                updateTermDto.schoolYearId !== term.schoolYearId) {
                const newSchoolYear = await this.schoolYearRepository.findOne({
                    where: { id: updateTermDto.schoolYearId },
                });
                if (!newSchoolYear) {
                    throw new common_1.NotFoundException('Année scolaire non trouvée');
                }
                schoolYear = newSchoolYear;
            }
            else if (!schoolYear) {
                const loadedSchoolYear = await this.schoolYearRepository.findOne({
                    where: { id: term.schoolYearId },
                });
                if (!loadedSchoolYear) {
                    throw new common_1.NotFoundException('Année scolaire non trouvée');
                }
                schoolYear = loadedSchoolYear;
            }
            if (updateTermDto.startDate && updateTermDto.endDate) {
                const startDate = new Date(updateTermDto.startDate);
                const endDate = new Date(updateTermDto.endDate);
                if (startDate >= endDate) {
                    throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
                }
                if (schoolYear && (startDate < schoolYear.startDate || endDate > schoolYear.endDate)) {
                    throw new common_1.BadRequestException("Les dates du trimestre doivent être comprises dans la période de l'année scolaire");
                }
            }
            else if (updateTermDto.startDate || updateTermDto.endDate) {
                const startDate = updateTermDto.startDate
                    ? new Date(updateTermDto.startDate)
                    : term.startDate;
                const endDate = updateTermDto.endDate
                    ? new Date(updateTermDto.endDate)
                    : term.endDate;
                if (startDate >= endDate) {
                    throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
                }
                if (schoolYear && (startDate < schoolYear.startDate || endDate > schoolYear.endDate)) {
                    throw new common_1.BadRequestException("Les dates du trimestre doivent être comprises dans la période de l'année scolaire");
                }
            }
            if (updateTermDto.name && updateTermDto.name !== term.name) {
                const existingTerm = await this.termRepository.findOne({
                    where: {
                        schoolYearId: finalSchoolYearId,
                        name: updateTermDto.name,
                    },
                });
                if (existingTerm && existingTerm.id !== id) {
                    throw new common_1.ConflictException('Un trimestre avec ce nom existe déjà dans cette année scolaire');
                }
            }
            if (updateTermDto.isActive && !term.isActive) {
                await this.termRepository.update({ schoolYearId: finalSchoolYearId }, { isActive: false });
            }
            Object.assign(term, {
                ...updateTermDto,
                startDate: updateTermDto.startDate
                    ? new Date(updateTermDto.startDate)
                    : term.startDate,
                endDate: updateTermDto.endDate
                    ? new Date(updateTermDto.endDate)
                    : term.endDate,
            });
            const updatedTerm = await this.termRepository.save(term);
            return this.mapToTermResponseDto(updatedTerm);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour du trimestre: ${message}`);
        }
    }
    async deleteTerm(id) {
        try {
            const term = await this.termRepository.findOne({
                where: { id },
                relations: ['assessments'],
            });
            if (!term) {
                throw new common_1.NotFoundException('Trimestre non trouvé');
            }
            if (term.assessments && term.assessments.length > 0) {
                throw new common_1.BadRequestException('Impossible de supprimer un trimestre qui contient des évaluations');
            }
            await this.termRepository.remove(term);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression du trimestre: ${message}`);
        }
    }
    async setActiveTerm(id) {
        try {
            const term = await this.termRepository.findOne({
                where: { id },
                relations: ['schoolYear'],
            });
            if (!term) {
                throw new common_1.NotFoundException('Trimestre non trouvé');
            }
            await this.termRepository.update({ schoolYearId: term.schoolYearId }, { isActive: false });
            term.isActive = true;
            const updatedTerm = await this.termRepository.save(term);
            return this.mapToTermResponseDto(updatedTerm);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de l'activation du trimestre: ${message}`);
        }
    }
    mapToTermResponseDto(term) {
        return {
            id: term.id,
            schoolYearId: term.schoolYearId,
            name: term.name,
            startDate: term.startDate,
            endDate: term.endDate,
            isActive: term.isActive,
            orderNumber: term.orderNumber,
            createdAt: term.createdAt,
            updatedAt: term.updatedAt,
            schoolYear: term.schoolYear
                ? {
                    id: term.schoolYear.id,
                    name: term.schoolYear.name,
                    startDate: term.schoolYear.startDate,
                    endDate: term.schoolYear.endDate,
                    isActive: term.schoolYear.isActive,
                    createdAt: term.schoolYear.createdAt,
                    updatedAt: term.schoolYear.updatedAt,
                }
                : undefined,
        };
    }
};
exports.TermService = TermService;
exports.TermService = TermService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(term_entity_1.Term)),
    __param(1, (0, typeorm_1.InjectRepository)(school_year_entity_1.SchoolYear)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TermService);
//# sourceMappingURL=term.service.js.map