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
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
const class_subject_service_1 = require("../services/class-subject.service");
const student_class_service_1 = require("../services/student-class.service");
const teaching_assignment_service_1 = require("../services/teaching-assignment.service");
const class_subject_dto_1 = require("../dto/class-subject.dto");
const student_class_dto_1 = require("../dto/student-class.dto");
const teaching_assignment_dto_1 = require("../dto/teaching-assignment.dto");
let ConfigController = class ConfigController {
    classSubjectService;
    studentClassService;
    teachingAssignmentService;
    constructor(classSubjectService, studentClassService, teachingAssignmentService) {
        this.classSubjectService = classSubjectService;
        this.studentClassService = studentClassService;
        this.teachingAssignmentService = teachingAssignmentService;
    }
    async createClassSubject(createClassSubjectDto) {
        return this.classSubjectService.createClassSubject(createClassSubjectDto);
    }
    async getAllClassSubjects() {
        return this.classSubjectService.getAllClassSubjects();
    }
    async getClassSubjectById(id) {
        return this.classSubjectService.getClassSubjectById(parseInt(id, 10));
    }
    async getClassSubjectsByClass(classId) {
        return this.classSubjectService.getClassSubjectsByClass(parseInt(classId, 10));
    }
    async getClassSubjectsBySubject(subjectId) {
        return this.classSubjectService.getClassSubjectsBySubject(parseInt(subjectId, 10));
    }
    async updateClassSubject(id, updateClassSubjectDto) {
        return this.classSubjectService.updateClassSubject(parseInt(id, 10), updateClassSubjectDto);
    }
    async deleteClassSubject(id) {
        return this.classSubjectService.deleteClassSubject(parseInt(id, 10));
    }
    async createStudentClass(createStudentClassDto) {
        return this.studentClassService.createStudentClass(createStudentClassDto);
    }
    async getAllStudentClasses() {
        return this.studentClassService.getAllStudentClasses();
    }
    async getStudentClassById(id) {
        return this.studentClassService.getStudentClassById(parseInt(id, 10));
    }
    async getStudentClassesByStudent(studentId) {
        return this.studentClassService.getStudentClassesByStudent(parseInt(studentId, 10));
    }
    async getStudentClassesByClass(classId) {
        return this.studentClassService.getStudentClassesByClass(parseInt(classId, 10));
    }
    async updateStudentClass(id, updateStudentClassDto) {
        return this.studentClassService.updateStudentClass(parseInt(id, 10), updateStudentClassDto);
    }
    async deleteStudentClass(id) {
        return this.studentClassService.deleteStudentClass(parseInt(id, 10));
    }
    async createTeachingAssignment(createTeachingAssignmentDto) {
        return this.teachingAssignmentService.createTeachingAssignment(createTeachingAssignmentDto);
    }
    async getAllTeachingAssignments() {
        return this.teachingAssignmentService.getAllTeachingAssignments();
    }
    async getTeachingAssignmentById(id) {
        return this.teachingAssignmentService.getTeachingAssignmentById(parseInt(id, 10));
    }
    async getTeachingAssignmentsByTeacher(teacherId) {
        return this.teachingAssignmentService.getTeachingAssignmentsByTeacher(parseInt(teacherId, 10));
    }
    async getTeachingAssignmentsByClassSubject(classSubjectId) {
        return this.teachingAssignmentService.getTeachingAssignmentsByClassSubject(parseInt(classSubjectId, 10));
    }
    async updateTeachingAssignment(id, updateTeachingAssignmentDto) {
        return this.teachingAssignmentService.updateTeachingAssignment(parseInt(id, 10), updateTeachingAssignmentDto);
    }
    async deleteTeachingAssignment(id) {
        return this.teachingAssignmentService.deleteTeachingAssignment(parseInt(id, 10));
    }
};
exports.ConfigController = ConfigController;
__decorate([
    (0, common_1.Post)('class-subjects'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [class_subject_dto_1.CreateClassSubjectDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "createClassSubject", null);
__decorate([
    (0, common_1.Get)('class-subjects'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getAllClassSubjects", null);
__decorate([
    (0, common_1.Get)('class-subjects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getClassSubjectById", null);
__decorate([
    (0, common_1.Get)('class-subjects/class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getClassSubjectsByClass", null);
__decorate([
    (0, common_1.Get)('class-subjects/subject/:subjectId'),
    __param(0, (0, common_1.Param)('subjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getClassSubjectsBySubject", null);
__decorate([
    (0, common_1.Put)('class-subjects/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, class_subject_dto_1.UpdateClassSubjectDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "updateClassSubject", null);
__decorate([
    (0, common_1.Delete)('class-subjects/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deleteClassSubject", null);
__decorate([
    (0, common_1.Post)('student-classes'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [student_class_dto_1.CreateStudentClassDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "createStudentClass", null);
__decorate([
    (0, common_1.Get)('student-classes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getAllStudentClasses", null);
__decorate([
    (0, common_1.Get)('student-classes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getStudentClassById", null);
__decorate([
    (0, common_1.Get)('student-classes/student/:studentId'),
    __param(0, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getStudentClassesByStudent", null);
__decorate([
    (0, common_1.Get)('student-classes/class/:classId'),
    __param(0, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getStudentClassesByClass", null);
__decorate([
    (0, common_1.Put)('student-classes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, student_class_dto_1.UpdateStudentClassDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "updateStudentClass", null);
__decorate([
    (0, common_1.Delete)('student-classes/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deleteStudentClass", null);
__decorate([
    (0, common_1.Post)('teaching-assignments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [teaching_assignment_dto_1.CreateTeachingAssignmentDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "createTeachingAssignment", null);
__decorate([
    (0, common_1.Get)('teaching-assignments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getAllTeachingAssignments", null);
__decorate([
    (0, common_1.Get)('teaching-assignments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getTeachingAssignmentById", null);
__decorate([
    (0, common_1.Get)('teaching-assignments/teacher/:teacherId'),
    __param(0, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getTeachingAssignmentsByTeacher", null);
__decorate([
    (0, common_1.Get)('teaching-assignments/class-subject/:classSubjectId'),
    __param(0, (0, common_1.Param)('classSubjectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "getTeachingAssignmentsByClassSubject", null);
__decorate([
    (0, common_1.Put)('teaching-assignments/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, teaching_assignment_dto_1.UpdateTeachingAssignmentDto]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "updateTeachingAssignment", null);
__decorate([
    (0, common_1.Delete)('teaching-assignments/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigController.prototype, "deleteTeachingAssignment", null);
exports.ConfigController = ConfigController = __decorate([
    (0, common_1.Controller)('config'),
    __metadata("design:paramtypes", [class_subject_service_1.ClassSubjectService,
        student_class_service_1.StudentClassService,
        teaching_assignment_service_1.TeachingAssignmentService])
], ConfigController);
//# sourceMappingURL=config.controller.js.map