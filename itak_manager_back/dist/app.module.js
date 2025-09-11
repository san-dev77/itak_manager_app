"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = __importDefault(require("./config/database.config"));
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const student_module_1 = require("./modules/student/student.module");
const teacher_module_1 = require("./modules/teacher/teacher.module");
const staff_module_1 = require("./modules/staff/staff.module");
const class_module_1 = require("./modules/class/class.module");
const class_category_module_1 = require("./modules/class-category/class-category.module");
const subject_module_1 = require("./modules/subject/subject.module");
const parent_module_1 = require("./modules/parent/parent.module");
const promotion_module_1 = require("./modules/promotion/promotion.module");
const school_year_module_1 = require("./modules/school-year/school-year.module");
const term_module_1 = require("./modules/term/term.module");
const assessment_module_1 = require("./modules/assessment/assessment.module");
const assessment_result_module_1 = require("./modules/assessment-result/assessment-result.module");
const grade_complaint_module_1 = require("./modules/grade-complaint/grade-complaint.module");
const assessment_subject_module_1 = require("./modules/assessment-subject/assessment-subject.module");
const student_transfer_module_1 = require("./modules/student-transfer/student-transfer.module");
const assessment_attendance_module_1 = require("./modules/assessment-attendance/assessment-attendance.module");
const grade_calculation_module_1 = require("./modules/grade-calculation/grade-calculation.module");
const assessment_version_module_1 = require("./modules/assessment-version/assessment-version.module");
const grade_freeze_module_1 = require("./modules/grade-freeze/grade-freeze.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: database_config_1.default,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            student_module_1.StudentModule,
            teacher_module_1.TeacherModule,
            staff_module_1.StaffModule,
            class_module_1.ClassModule,
            class_category_module_1.ClassCategoryModule,
            subject_module_1.SubjectModule,
            parent_module_1.ParentModule,
            promotion_module_1.PromotionModule,
            school_year_module_1.SchoolYearModule,
            term_module_1.TermModule,
            assessment_module_1.AssessmentModule,
            assessment_result_module_1.AssessmentResultModule,
            grade_complaint_module_1.GradeComplaintModule,
            assessment_subject_module_1.AssessmentSubjectModule,
            student_transfer_module_1.StudentTransferModule,
            assessment_attendance_module_1.AssessmentAttendanceModule,
            grade_calculation_module_1.GradeCalculationModule,
            assessment_version_module_1.AssessmentVersionModule,
            grade_freeze_module_1.GradeFreezeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map