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
exports.TeacherController = void 0;
const common_1 = require("@nestjs/common");
const teacher_service_1 = require("../services/teacher.service");
const teacher_dto_1 = require("../dto/teacher.dto");
let TeacherController = class TeacherController {
    teacherService;
    constructor(teacherService) {
        this.teacherService = teacherService;
    }
    async createTeacher(createTeacherDto) {
        return this.teacherService.createTeacher(createTeacherDto);
    }
    async getAllTeachers() {
        return this.teacherService.getAllTeachers();
    }
    async getTeacherById(id) {
        return this.teacherService.getTeacherById(parseInt(id, 10));
    }
    async getTeacherByUserId(userId) {
        return this.teacherService.getTeacherByUserId(parseInt(userId, 10));
    }
    async getTeacherByMatricule(matricule) {
        return this.teacherService.getTeacherByMatricule(matricule);
    }
    async getTeachersBySpecialty(specialty) {
        return this.teacherService.getTeachersBySpecialty(specialty);
    }
    async updateTeacher(id, updateTeacherDto) {
        return this.teacherService.updateTeacher(parseInt(id, 10), updateTeacherDto);
    }
    async deleteTeacher(id) {
        return this.teacherService.deleteTeacher(parseInt(id, 10));
    }
};
exports.TeacherController = TeacherController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teacher_dto_1.CreateTeacherDto]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "createTeacher", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getAllTeachers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherById", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherByUserId", null);
__decorate([
    (0, common_1.Get)('matricule/:matricule'),
    __param(0, (0, common_1.Param)('matricule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeacherByMatricule", null);
__decorate([
    (0, common_1.Get)('specialty/:specialty'),
    __param(0, (0, common_1.Param)('specialty')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "getTeachersBySpecialty", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teacher_dto_1.UpdateTeacherDto]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "updateTeacher", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeacherController.prototype, "deleteTeacher", null);
exports.TeacherController = TeacherController = __decorate([
    (0, common_1.Controller)('teachers'),
    __metadata("design:paramtypes", [teacher_service_1.TeacherService])
], TeacherController);
//# sourceMappingURL=teacher.controller.js.map