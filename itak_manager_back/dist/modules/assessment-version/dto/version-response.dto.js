"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionStatsDto = exports.VersionComparisonDto = exports.VersionResponseDto = void 0;
class VersionResponseDto {
    id;
    assessmentId;
    versionNumber;
    versionAction;
    termId;
    classSubjectId;
    schoolYearId;
    type;
    title;
    description;
    startDate;
    endDate;
    maxScore;
    weight;
    changedBy;
    changeReason;
    changedFields;
    createdAt;
    user;
}
exports.VersionResponseDto = VersionResponseDto;
class VersionComparisonDto {
    from;
    to;
    differences;
}
exports.VersionComparisonDto = VersionComparisonDto;
class VersionStatsDto {
    totalVersions;
    createdVersions;
    updatedVersions;
    deletedVersions;
    restoredVersions;
    firstVersion;
    lastVersion;
}
exports.VersionStatsDto = VersionStatsDto;
//# sourceMappingURL=version-response.dto.js.map