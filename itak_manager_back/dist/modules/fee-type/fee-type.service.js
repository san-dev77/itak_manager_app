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
exports.FeeTypeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fee_type_entity_1 = require("../../entities/fee-type.entity");
let FeeTypeService = class FeeTypeService {
    feeTypeRepository;
    constructor(feeTypeRepository) {
        this.feeTypeRepository = feeTypeRepository;
    }
    async create(createFeeTypeDto) {
        const existingFeeType = await this.feeTypeRepository.findOne({
            where: { name: createFeeTypeDto.name },
        });
        if (existingFeeType) {
            throw new common_1.ConflictException(`Un type de frais avec le nom "${createFeeTypeDto.name}" existe déjà`);
        }
        const feeType = this.feeTypeRepository.create(createFeeTypeDto);
        return await this.feeTypeRepository.save(feeType);
    }
    async findAll() {
        return await this.feeTypeRepository.find({
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        const feeType = await this.feeTypeRepository.findOne({
            where: { id },
            relations: ['studentFees'],
        });
        if (!feeType) {
            throw new common_1.NotFoundException(`Type de frais avec l'ID ${id} non trouvé`);
        }
        return feeType;
    }
    async update(id, updateFeeTypeDto) {
        const feeType = await this.findOne(id);
        if (updateFeeTypeDto.name && updateFeeTypeDto.name !== feeType.name) {
            const existingFeeType = await this.feeTypeRepository.findOne({
                where: { name: updateFeeTypeDto.name },
            });
            if (existingFeeType) {
                throw new common_1.ConflictException(`Un type de frais avec le nom "${updateFeeTypeDto.name}" existe déjà`);
            }
        }
        Object.assign(feeType, updateFeeTypeDto);
        return await this.feeTypeRepository.save(feeType);
    }
    async remove(id) {
        const feeType = await this.findOne(id);
        await this.feeTypeRepository.remove(feeType);
    }
    async findByName(name) {
        return await this.feeTypeRepository.findOne({
            where: { name },
        });
    }
    async findRecurringFeeTypes() {
        return await this.feeTypeRepository.find({
            where: { isRecurring: true },
            order: { name: 'ASC' },
        });
    }
};
exports.FeeTypeService = FeeTypeService;
exports.FeeTypeService = FeeTypeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(fee_type_entity_1.FeeType)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FeeTypeService);
//# sourceMappingURL=fee-type.service.js.map