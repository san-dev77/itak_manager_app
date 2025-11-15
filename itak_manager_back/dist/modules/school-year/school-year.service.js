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
exports.SchoolYearService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const school_year_entity_1 = require("../../entities/school-year.entity");
const term_entity_1 = require("../../entities/term.entity");
let SchoolYearService = class SchoolYearService {
    schoolYearRepository;
    termRepository;
    constructor(schoolYearRepository, termRepository) {
        this.schoolYearRepository = schoolYearRepository;
        this.termRepository = termRepository;
    }
    async createSchoolYear(createSchoolYearDto) {
        try {
            const startDate = new Date(createSchoolYearDto.startDate);
            const endDate = new Date(createSchoolYearDto.endDate);
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
            }
            const existingSchoolYear = await this.schoolYearRepository.findOne({
                where: { name: createSchoolYearDto.name },
            });
            if (existingSchoolYear) {
                throw new common_1.ConflictException('Une année scolaire avec ce nom existe déjà');
            }
            if (createSchoolYearDto.isActive) {
                const activeSchoolYears = await this.schoolYearRepository.find({
                    where: { isActive: true },
                });
                if (activeSchoolYears.length > 0) {
                    await Promise.all(activeSchoolYears.map((schoolYear) => this.schoolYearRepository.update(schoolYear.id, {
                        isActive: false,
                    })));
                }
            }
            const schoolYear = this.schoolYearRepository.create({
                name: createSchoolYearDto.name,
                startDate: startDate,
                endDate: endDate,
                isActive: createSchoolYearDto.isActive || false,
            });
            const savedSchoolYear = await this.schoolYearRepository.save(schoolYear);
            const schoolYearWithRelations = await this.schoolYearRepository.findOne({
                where: { id: savedSchoolYear.id },
                relations: ['terms'],
            });
            if (!schoolYearWithRelations) {
                throw new Error("Erreur lors de la récupération de l'année scolaire créée");
            }
            return this.mapToSchoolYearResponseDto(schoolYearWithRelations);
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de l'année scolaire: ${message}`);
        }
    }
    async getAllSchoolYears() {
        try {
            const schoolYears = await this.schoolYearRepository.find({
                relations: ['terms'],
                order: { startDate: 'DESC' },
            });
            return schoolYears.map((schoolYear) => this.mapToSchoolYearResponseDto(schoolYear));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des années scolaires: ${message}`);
        }
    }
    async getSchoolYearById(id) {
        try {
            const schoolYear = await this.schoolYearRepository.findOne({
                where: { id },
                relations: ['terms'],
            });
            if (!schoolYear) {
                throw new common_1.NotFoundException('Année scolaire non trouvée');
            }
            return this.mapToSchoolYearResponseDto(schoolYear);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'année scolaire: ${message}`);
        }
    }
    async getActiveSchoolYear() {
        try {
            const activeSchoolYear = await this.schoolYearRepository.findOne({
                where: { isActive: true },
                relations: ['terms'],
            });
            if (!activeSchoolYear) {
                throw new common_1.NotFoundException('Aucune année scolaire active trouvée');
            }
            return this.mapToSchoolYearResponseDto(activeSchoolYear);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'année scolaire active: ${message}`);
        }
    }
    async updateSchoolYear(id, updateSchoolYearDto) {
        try {
            const schoolYear = await this.schoolYearRepository.findOne({
                where: { id },
            });
            if (!schoolYear) {
                throw new common_1.NotFoundException('Année scolaire non trouvée');
            }
            if (updateSchoolYearDto.startDate && updateSchoolYearDto.endDate) {
                const startDate = new Date(updateSchoolYearDto.startDate);
                const endDate = new Date(updateSchoolYearDto.endDate);
                if (startDate >= endDate) {
                    throw new common_1.BadRequestException('La date de début doit être antérieure à la date de fin');
                }
            }
            if (updateSchoolYearDto.name &&
                updateSchoolYearDto.name !== schoolYear.name) {
                const existingSchoolYear = await this.schoolYearRepository.findOne({
                    where: { name: updateSchoolYearDto.name },
                });
                if (existingSchoolYear) {
                    throw new common_1.ConflictException('Une année scolaire avec ce nom existe déjà');
                }
            }
            if (updateSchoolYearDto.isActive && !schoolYear.isActive) {
                const activeSchoolYears = await this.schoolYearRepository.find({
                    where: { isActive: true },
                });
                if (activeSchoolYears.length > 0) {
                    await Promise.all(activeSchoolYears
                        .filter((sy) => sy.id !== id)
                        .map((sy) => this.schoolYearRepository.update(sy.id, { isActive: false })));
                }
            }
            Object.assign(schoolYear, {
                ...updateSchoolYearDto,
                startDate: updateSchoolYearDto.startDate
                    ? new Date(updateSchoolYearDto.startDate)
                    : schoolYear.startDate,
                endDate: updateSchoolYearDto.endDate
                    ? new Date(updateSchoolYearDto.endDate)
                    : schoolYear.endDate,
            });
            const updatedSchoolYear = await this.schoolYearRepository.save(schoolYear);
            return this.mapToSchoolYearResponseDto(updatedSchoolYear);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de l'année scolaire: ${message}`);
        }
    }
    async deleteSchoolYear(id) {
        try {
            const schoolYear = await this.schoolYearRepository.findOne({
                where: { id },
                relations: ['terms'],
            });
            if (!schoolYear) {
                throw new common_1.NotFoundException('Année scolaire non trouvée');
            }
            if (schoolYear.terms && schoolYear.terms.length > 0) {
                throw new common_1.BadRequestException('Impossible de supprimer une année scolaire qui contient des trimestres');
            }
            await this.schoolYearRepository.remove(schoolYear);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de l'année scolaire: ${message}`);
        }
    }
    async setActiveSchoolYear(id) {
        try {
            const schoolYear = await this.schoolYearRepository.findOne({
                where: { id },
            });
            if (!schoolYear) {
                throw new common_1.NotFoundException('Année scolaire non trouvée');
            }
            const activeSchoolYears = await this.schoolYearRepository.find({
                where: { isActive: true },
            });
            if (activeSchoolYears.length > 0) {
                await Promise.all(activeSchoolYears.map((sy) => this.schoolYearRepository.update(sy.id, { isActive: false })));
            }
            schoolYear.isActive = true;
            const updatedSchoolYear = await this.schoolYearRepository.save(schoolYear);
            return this.mapToSchoolYearResponseDto(updatedSchoolYear);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de l'activation de l'année scolaire: ${message}`);
        }
    }
    mapToSchoolYearResponseDto(schoolYear) {
        return {
            id: schoolYear.id,
            name: schoolYear.name,
            startDate: schoolYear.startDate,
            endDate: schoolYear.endDate,
            isActive: schoolYear.isActive,
            createdAt: schoolYear.createdAt,
            updatedAt: schoolYear.updatedAt,
            terms: schoolYear.terms?.map((term) => ({
                id: term.id,
                schoolYearId: term.schoolYearId,
                name: term.name,
                startDate: term.startDate,
                endDate: term.endDate,
                isActive: term.isActive,
                orderNumber: term.orderNumber,
                createdAt: term.createdAt,
                updatedAt: term.updatedAt,
            })),
        };
    }
};
exports.SchoolYearService = SchoolYearService;
exports.SchoolYearService = SchoolYearService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(school_year_entity_1.SchoolYear)),
    __param(1, (0, typeorm_1.InjectRepository)(term_entity_1.Term)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SchoolYearService);
//# sourceMappingURL=school-year.service.js.map