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
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_entity_1 = require("../../entities/class.entity");
const student_entity_1 = require("../../entities/student.entity");
const student_class_entity_1 = require("../../entities/student-class.entity");
const student_promotion_entity_1 = require("../../entities/student-promotion.entity");
let PromotionService = class PromotionService {
    classRepository;
    studentRepository;
    studentClassRepository;
    studentPromotionRepository;
    constructor(classRepository, studentRepository, studentClassRepository, studentPromotionRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.studentClassRepository = studentClassRepository;
        this.studentPromotionRepository = studentPromotionRepository;
    }
    async getNextClass(currentClassId) {
        try {
            const currentClass = await this.classRepository.findOne({
                where: { id: currentClassId },
                relations: ['classCategory'],
            });
            if (!currentClass) {
                throw new common_1.NotFoundException('Classe actuelle non trouvée');
            }
            const nextClass = await this.classRepository.findOne({
                where: {
                    categoryId: currentClass.categoryId,
                    orderLevel: currentClass.orderLevel + 1,
                },
                relations: ['classCategory'],
            });
            const canPromote = nextClass !== null;
            const message = canPromote
                ? `Promotion possible vers ${nextClass.name}`
                : 'Aucune classe supérieure disponible dans cette catégorie';
            return {
                currentClass,
                nextClass,
                canPromote,
                message,
            };
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la recherche de la classe supérieure: ${message}`);
        }
    }
    async promoteStudent(createPromotionDto) {
        try {
            const student = await this.studentRepository.findOne({
                where: { id: createPromotionDto.studentId },
                relations: ['user'],
            });
            if (!student) {
                throw new common_1.NotFoundException('Étudiant non trouvé');
            }
            const currentStudentClass = await this.studentClassRepository.findOne({
                where: { studentId: createPromotionDto.studentId },
                relations: ['class', 'class.classCategory'],
                order: { createdAt: 'DESC' },
            });
            if (!currentStudentClass) {
                throw new common_1.NotFoundException('Aucune classe actuelle trouvée pour cet étudiant');
            }
            const toClass = await this.classRepository.findOne({
                where: { id: createPromotionDto.toClassId },
                relations: ['classCategory'],
            });
            if (!toClass) {
                throw new common_1.NotFoundException('Classe de destination non trouvée');
            }
            if (toClass.orderLevel <= currentStudentClass.class.orderLevel) {
                throw new common_1.BadRequestException('La classe de destination doit avoir un niveau supérieur à la classe actuelle');
            }
            const promotion = this.studentPromotionRepository.create({
                studentId: createPromotionDto.studentId,
                fromClassId: currentStudentClass.class.id,
                toClassId: createPromotionDto.toClassId,
                year: createPromotionDto.year,
                remarks: createPromotionDto.remarks,
            });
            const savedPromotion = await this.studentPromotionRepository.save(promotion);
            await this.studentClassRepository.update({ studentId: createPromotionDto.studentId }, { classId: createPromotionDto.toClassId });
            return {
                student,
                fromClass: currentStudentClass.class,
                toClass,
                year: savedPromotion.year,
                remarks: savedPromotion.remarks,
                createdAt: savedPromotion.createdAt,
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la promotion de l'étudiant: ${message}`);
        }
    }
    async bulkPromoteClass(bulkPromotionDto) {
        try {
            const fromClass = await this.classRepository.findOne({
                where: { id: bulkPromotionDto.fromClassId },
                relations: ['classCategory'],
            });
            const toClass = await this.classRepository.findOne({
                where: { id: bulkPromotionDto.toClassId },
                relations: ['classCategory'],
            });
            if (!fromClass || !toClass) {
                throw new common_1.NotFoundException('Classe source ou destination non trouvée');
            }
            if (toClass.orderLevel <= fromClass.orderLevel) {
                throw new common_1.BadRequestException('La classe de destination doit avoir un niveau supérieur à la classe source');
            }
            const studentClasses = await this.studentClassRepository.find({
                where: { classId: bulkPromotionDto.fromClassId },
                relations: ['student', 'student.user'],
            });
            if (studentClasses.length === 0) {
                throw new common_1.NotFoundException('Aucun étudiant trouvé dans la classe source');
            }
            const promotions = [];
            for (const studentClass of studentClasses) {
                const promotionDto = {
                    studentId: studentClass.student.id,
                    toClassId: bulkPromotionDto.toClassId,
                    year: bulkPromotionDto.year,
                    remarks: bulkPromotionDto.remarks,
                };
                const promotion = await this.promoteStudent(promotionDto);
                promotions.push(promotion);
            }
            return promotions;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.BadRequestException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la promotion en masse: ${message}`);
        }
    }
    async getPromotionHistory(studentId) {
        try {
            const promotions = await this.studentPromotionRepository.find({
                where: { studentId },
                relations: ['student', 'student.user', 'fromClass', 'toClass'],
                order: { createdAt: 'DESC' },
            });
            return promotions.map((promotion) => ({
                student: promotion.student,
                fromClass: promotion.fromClass,
                toClass: promotion.toClass,
                year: promotion.year,
                remarks: promotion.remarks,
                createdAt: promotion.createdAt,
            }));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération de l'historique: ${message}`);
        }
    }
    async getClassesByOrderLevel(categoryId) {
        try {
            return await this.classRepository.find({
                where: { categoryId },
                relations: ['classCategory'],
                order: { orderLevel: 'ASC' },
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération des classes: ${message}`);
        }
    }
};
exports.PromotionService = PromotionService;
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(student_class_entity_1.StudentClass)),
    __param(3, (0, typeorm_1.InjectRepository)(student_promotion_entity_1.StudentPromotion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map