"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssessmentAttendanceDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_assessment_attendance_dto_1 = require("./create-assessment-attendance.dto");
class UpdateAssessmentAttendanceDto extends (0, mapped_types_1.PartialType)(create_assessment_attendance_dto_1.CreateAssessmentAttendanceDto) {
}
exports.UpdateAssessmentAttendanceDto = UpdateAssessmentAttendanceDto;
//# sourceMappingURL=update-assessment-attendance.dto.js.map