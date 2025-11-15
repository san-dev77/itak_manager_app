"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
const assessment_entity_1 = require("../entities/assessment.entity");
const assessment_result_entity_1 = require("../entities/assessment-result.entity");
const student_promotion_entity_1 = require("../entities/student-promotion.entity");
const grade_complaint_entity_1 = require("../entities/grade-complaint.entity");
const grade_complaint_history_entity_1 = require("../entities/grade-complaint-history.entity");
const student_transfer_entity_1 = require("../entities/student-transfer.entity");
const assessment_attendance_entity_1 = require("../entities/assessment-attendance.entity");
const school_year_entity_1 = require("../entities/school-year.entity");
const term_entity_1 = require("../entities/term.entity");
const assessment_subject_entity_1 = require("../entities/assessment-subject.entity");
const assessment_version_entity_1 = require("../entities/assessment-version.entity");
const grade_freeze_period_entity_1 = require("../entities/grade-freeze-period.entity");
const student_fee_entity_1 = require("../entities/student-fee.entity");
const fee_type_entity_1 = require("../entities/fee-type.entity");
const payment_entity_1 = require("../entities/payment.entity");
const refund_entity_1 = require("../entities/refund.entity");
const discount_entity_1 = require("../entities/discount.entity");
const invoice_entity_1 = require("../entities/invoice.entity");
const invoice_item_entity_1 = require("../entities/invoice-item.entity");
const class_category_entity_1 = require("../entities/class-category.entity");
const class_subject_entity_1 = require("../entities/class-subject.entity");
const parent_entity_1 = require("../entities/parent.entity");
const staff_entity_1 = require("../entities/staff.entity");
const student_entity_1 = require("../entities/student.entity");
const student_class_entity_1 = require("../entities/student-class.entity");
const student_parent_entity_1 = require("../entities/student-parent.entity");
const timetable_entity_1 = require("../entities/timetable.entity");
const event_entity_1 = require("../entities/event.entity");
const event_participant_entity_1 = require("../entities/event-participant.entity");
const teacher_entity_1 = require("../entities/teacher.entity");
const teaching_assignment_entity_1 = require("../entities/teaching-assignment.entity");
const user_entity_1 = require("../entities/user.entity");
const subject_entity_1 = require("../entities/subject.entity");
const class_entity_1 = require("../entities/class.entity");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    url: process.env.DB_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'itak_manager',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [
        assessment_result_entity_1.AssessmentResult,
        assessment_subject_entity_1.AssessmentSubject,
        assessment_entity_1.Assessment,
        class_category_entity_1.ClassCategory,
        class_subject_entity_1.ClassSubject,
        class_entity_1.Class,
        fee_type_entity_1.FeeType,
        grade_complaint_entity_1.GradeComplaint,
        grade_complaint_history_entity_1.GradeComplaintHistory,
        parent_entity_1.Parent,
        school_year_entity_1.SchoolYear,
        staff_entity_1.Staff,
        student_entity_1.Student,
        student_class_entity_1.StudentClass,
        student_parent_entity_1.StudentParent,
        student_promotion_entity_1.StudentPromotion,
        student_transfer_entity_1.StudentTransfer,
        assessment_attendance_entity_1.AssessmentAttendance,
        assessment_version_entity_1.AssessmentVersion,
        grade_freeze_period_entity_1.GradeFreezePeriod,
        subject_entity_1.Subject,
        student_fee_entity_1.StudentFee,
        payment_entity_1.Payment,
        refund_entity_1.Refund,
        discount_entity_1.Discount,
        invoice_entity_1.Invoice,
        invoice_item_entity_1.InvoiceItem,
        timetable_entity_1.Timetable,
        event_entity_1.Event,
        event_participant_entity_1.EventParticipant,
        teacher_entity_1.Teacher,
        teaching_assignment_entity_1.TeachingAssignment,
        term_entity_1.Term,
        user_entity_1.User,
    ],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    migrationsRun: true,
}));
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    url: process.env.DB_URL,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'itak_manager',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    entities: [
        assessment_result_entity_1.AssessmentResult,
        assessment_subject_entity_1.AssessmentSubject,
        assessment_entity_1.Assessment,
        class_category_entity_1.ClassCategory,
        class_subject_entity_1.ClassSubject,
        class_entity_1.Class,
        fee_type_entity_1.FeeType,
        grade_complaint_entity_1.GradeComplaint,
        grade_complaint_history_entity_1.GradeComplaintHistory,
        parent_entity_1.Parent,
        school_year_entity_1.SchoolYear,
        staff_entity_1.Staff,
        student_entity_1.Student,
        student_class_entity_1.StudentClass,
        student_parent_entity_1.StudentParent,
        student_promotion_entity_1.StudentPromotion,
        student_transfer_entity_1.StudentTransfer,
        assessment_attendance_entity_1.AssessmentAttendance,
        assessment_version_entity_1.AssessmentVersion,
        grade_freeze_period_entity_1.GradeFreezePeriod,
        subject_entity_1.Subject,
        student_fee_entity_1.StudentFee,
        payment_entity_1.Payment,
        refund_entity_1.Refund,
        discount_entity_1.Discount,
        invoice_entity_1.Invoice,
        invoice_item_entity_1.InvoiceItem,
        timetable_entity_1.Timetable,
        event_entity_1.Event,
        event_participant_entity_1.EventParticipant,
        teacher_entity_1.Teacher,
        teaching_assignment_entity_1.TeachingAssignment,
        term_entity_1.Term,
        user_entity_1.User,
    ],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
    migrationsRun: true,
});
//# sourceMappingURL=database.config.js.map