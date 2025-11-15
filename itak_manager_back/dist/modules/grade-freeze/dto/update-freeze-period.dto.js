"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateFreezePeriodDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_freeze_period_dto_1 = require("./create-freeze-period.dto");
class UpdateFreezePeriodDto extends (0, mapped_types_1.PartialType)(create_freeze_period_dto_1.CreateFreezePeriodDto) {
}
exports.UpdateFreezePeriodDto = UpdateFreezePeriodDto;
//# sourceMappingURL=update-freeze-period.dto.js.map