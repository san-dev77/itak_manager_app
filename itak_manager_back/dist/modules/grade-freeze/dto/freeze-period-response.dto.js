"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOverrideDto = exports.CancelFreezePeriodDto = exports.ApproveFreezePeriodDto = exports.FreezeStatusCheckDto = exports.FreezePeriodResponseDto = void 0;
class FreezePeriodResponseDto {
    id;
    schoolYearId;
    termId;
    classId;
    title;
    description;
    scope;
    status;
    startDate;
    endDate;
    createdBy;
    approvedBy;
    approvedAt;
    cancelledBy;
    cancelledAt;
    cancellationReason;
    allowEmergencyOverride;
    createdAt;
    updatedAt;
    schoolYear;
    term;
    class;
    creator;
    approver;
    canceller;
}
exports.FreezePeriodResponseDto = FreezePeriodResponseDto;
class FreezeStatusCheckDto {
    isFrozen;
    freezePeriod;
    canOverride;
}
exports.FreezeStatusCheckDto = FreezeStatusCheckDto;
class ApproveFreezePeriodDto {
    approvedBy;
}
exports.ApproveFreezePeriodDto = ApproveFreezePeriodDto;
class CancelFreezePeriodDto {
    cancelledBy;
    reason;
}
exports.CancelFreezePeriodDto = CancelFreezePeriodDto;
class VerifyOverrideDto {
    password;
}
exports.VerifyOverrideDto = VerifyOverrideDto;
//# sourceMappingURL=freeze-period-response.dto.js.map