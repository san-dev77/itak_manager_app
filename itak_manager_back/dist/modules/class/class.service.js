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
exports.ClassService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("../../entities/class.entity");
let ClassService = class ClassService {
    classRepository;
    constructor(classRepository) {
        this.classRepository = classRepository;
    }
    async createClass(createClassDto) {
        try {
            const existingClass = await this.classRepository.findOne({
                where: { code: createClassDto.code },
            });
            if (existingClass) {
                throw new common_1.ConflictException('Une classe avec ce code existe déjà');
            }
            const existingClassName = await this.classRepository.findOne({
                where: { name: createClassDto.name },
            });
            if (existingClassName) {
                throw new common_1.ConflictException('Une classe avec ce nom existe déjà');
            }
            const classEntity = this.classRepository.create({
                ...createClassDto,
                categoryId: createClassDto.classCategoryId,
            });
            const savedClass = await this.classRepository.save(classEntity);
            return this.mapToClassResponseDto(savedClass);
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création de la classe: ${message}`);
        }
    }
    async getAllClasses() {
        try {
            const classes = await this.classRepository.find({
                order: { createdAt: 'DESC' },
            });
            return classes.map((classEntity) => this.mapToClassResponseDto(classEntity));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes: ${message}`);
        }
    }
    async getClassById(id) {
        try {
            const classEntity = await this.classRepository.findOne({
                where: { id },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            return this.mapToClassResponseDto(classEntity);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la classe: ${message}`);
        }
    }
    async getClassByCode(code) {
        try {
            const classEntity = await this.classRepository.findOne({
                where: { code },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            return this.mapToClassResponseDto(classEntity);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la classe: ${message}`);
        }
    }
    async getClassByName(name) {
        try {
            const classEntity = await this.classRepository.findOne({
                where: { name },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('Classe non trouvée');
            }
            return this.mapToClassResponseDto(classEntity);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de la classe: ${message}`);
        }
    }
    async updateClass(id, updateClassDto) {
        try {
            await this.getClassById(id);
            if (updateClassDto.code) {
                const existingClass = await this.classRepository.findOne({
                    where: { code: updateClassDto.code },
                });
                if (existingClass && existingClass.id !== id) {
                    throw new common_1.ConflictException('Une classe avec ce code existe déjà');
                }
            }
            if (updateClassDto.name) {
                const existingClassName = await this.classRepository.findOne({
                    where: { name: updateClassDto.name },
                });
                if (existingClassName && existingClassName.id !== id) {
                    throw new common_1.ConflictException('Une classe avec ce nom existe déjà');
                }
            }
            const updateData = { ...updateClassDto };
            if (updateClassDto.classCategoryId) {
                updateData.categoryId = updateClassDto.classCategoryId;
            }
            await this.classRepository.update(id, updateData);
            const updatedClass = await this.classRepository.findOne({
                where: { id },
            });
            if (!updatedClass) {
                throw new common_1.NotFoundException('Classe non trouvée après mise à jour');
            }
            return this.mapToClassResponseDto(updatedClass);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour de la classe: ${message}`);
        }
    }
    async deleteClass(id) {
        try {
            await this.getClassById(id);
            await this.classRepository.delete(id);
            return { message: 'Classe supprimée avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression de la classe: ${message}`);
        }
    }
    async getClassesByCategory(categoryId) {
        try {
            const classes = await this.classRepository.find({
                where: { categoryId },
                order: { createdAt: 'DESC' },
            });
            return classes.map((classEntity) => this.mapToClassResponseDto(classEntity));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes par catégorie: ${message}`);
        }
    }
    getClassesByLevel(level) {
        try {
            return Promise.resolve([]);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes par niveau: ${message}`);
        }
    }
    mapToClassResponseDto(classEntity) {
        return {
            id: classEntity.id,
            name: classEntity.name,
            code: classEntity.code,
            classCategory: classEntity.classCategory,
            description: classEntity.description,
            level: classEntity.level,
            capacity: classEntity.capacity,
            orderLevel: classEntity.orderLevel,
            createdAt: classEntity.createdAt,
            updatedAt: classEntity.updatedAt,
            classSubjects: classEntity.classSubjects,
            studentClasses: classEntity.studentClasses,
        };
    }
};
exports.ClassService = ClassService;
exports.ClassService = ClassService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ClassService);
//# sourceMappingURL=class.service.js.map