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
exports.SubjectController = void 0;
const common_1 = require("@nestjs/common");
const subject_service_1 = require("../services/subject.service");
const subject_dto_1 = require("../dto/subject.dto");
let SubjectController = class SubjectController {
    subjectService;
    constructor(subjectService) {
        this.subjectService = subjectService;
    }
    async createSubject(createSubjectDto) {
        return this.subjectService.createSubject(createSubjectDto);
    }
    async getAllSubjects() {
        return this.subjectService.getAllSubjects();
    }
    async getSubjectById(id) {
        return this.subjectService.getSubjectById(parseInt(id, 10));
    }
    async getSubjectByCode(code) {
        return this.subjectService.getSubjectByCode(code);
    }
    async getSubjectsByName(name) {
        return this.subjectService.getSubjectsByName(name);
    }
    async getSubjectsByCategory(categoryId) {
        return this.subjectService.getSubjectsByCategory(parseInt(categoryId, 10));
    }
    async updateSubject(id, updateSubjectDto) {
        return this.subjectService.updateSubject(parseInt(id, 10), updateSubjectDto);
    }
    async deleteSubject(id) {
        return this.subjectService.deleteSubject(parseInt(id, 10));
    }
};
exports.SubjectController = SubjectController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subject_dto_1.CreateSubjectDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "createSubject", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "getAllSubjects", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "getSubjectById", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "getSubjectByCode", null);
__decorate([
    (0, common_1.Get)('name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "getSubjectsByName", null);
__decorate([
    (0, common_1.Get)('category/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "getSubjectsByCategory", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, subject_dto_1.UpdateSubjectDto]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "updateSubject", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubjectController.prototype, "deleteSubject", null);
exports.SubjectController = SubjectController = __decorate([
    (0, common_1.Controller)('subjects'),
    __metadata("design:paramtypes", [subject_service_1.SubjectService])
], SubjectController);
//# sourceMappingURL=subject.controller.js.map