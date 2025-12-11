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
const bullmq_1 = require("@nestjs/bullmq");
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
const fee_type_module_1 = require("./modules/fee-type/fee-type.module");
const student_fee_module_1 = require("./modules/student-fee/student-fee.module");
const payment_module_1 = require("./modules/payment/payment.module");
const refund_module_1 = require("./modules/refund/refund.module");
const discount_module_1 = require("./modules/discount/discount.module");
const invoice_module_1 = require("./modules/invoice/invoice.module");
const invoice_item_module_1 = require("./modules/invoice-item/invoice-item.module");
const timetable_module_1 = require("./modules/timetable/timetable.module");
const event_module_1 = require("./modules/event/event.module");
const event_participant_module_1 = require("./modules/event-participant/event-participant.module");
const teaching_assignment_module_1 = require("./modules/teaching-assignment/teaching-assignment.module");
const class_subject_module_1 = require("./modules/class-subject/class-subject.module");
const student_class_module_1 = require("./modules/student-class/student-class.module");
const email_module_1 = require("./modules/email/email.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                }),
                inject: [config_1.ConfigService],
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
            fee_type_module_1.FeeTypeModule,
            student_fee_module_1.StudentFeeModule,
            payment_module_1.PaymentModule,
            refund_module_1.RefundModule,
            discount_module_1.DiscountModule,
            invoice_module_1.InvoiceModule,
            invoice_item_module_1.InvoiceItemModule,
            timetable_module_1.TimetableModule,
            event_module_1.EventModule,
            event_participant_module_1.EventParticipantModule,
            teaching_assignment_module_1.TeachingAssignmentModule,
            class_subject_module_1.ClassSubjectModule,
            student_class_module_1.StudentClassModule,
            email_module_1.EmailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map