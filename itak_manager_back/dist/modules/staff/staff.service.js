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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const staff_entity_1 = require("../../entities/staff.entity");
const user_entity_1 = require("../../entities/user.entity");
let StaffService = class StaffService {
    staffRepository;
    userRepository;
    constructor(staffRepository, userRepository) {
        this.staffRepository = staffRepository;
        this.userRepository = userRepository;
    }
    async createStaff(createStaffDto) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: createStaffDto.userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('Utilisateur non trouvé');
            }
            const existingStaff = await this.staffRepository.findOne({
                where: { matricule: createStaffDto.matricule },
            });
            if (existingStaff) {
                throw new common_1.ConflictException('Un membre du personnel avec ce matricule existe déjà');
            }
            const staffExists = await this.staffRepository.findOne({
                where: { userId: createStaffDto.userId },
            });
            if (staffExists) {
                throw new common_1.ConflictException('Cet utilisateur est déjà du personnel administratif');
            }
            const staff = this.staffRepository.create({
                ...createStaffDto,
                hireDate: createStaffDto.hireDate,
            });
            const savedStaff = await this.staffRepository.save(staff);
            const staffWithUser = await this.staffRepository.findOne({
                where: { id: savedStaff.id },
                relations: ['user'],
            });
            if (!staffWithUser) {
                throw new Error('Erreur lors de la récupération du membre du personnel créé');
            }
            return this.mapToStaffResponseDto(staffWithUser);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la création du personnel: ${message}`);
        }
    }
    async getAllStaff() {
        try {
            const staff = await this.staffRepository.find({
                relations: ['user'],
                order: { createdAt: 'DESC' },
            });
            return staff.map((staffMember) => this.mapToStaffResponseDto(staffMember));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du personnel: ${message}`);
        }
    }
    async getStaffById(id) {
        try {
            const staff = await this.staffRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponseDto(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du personnel: ${message}`);
        }
    }
    async getStaffByUserId(userId) {
        try {
            const staff = await this.staffRepository.findOne({
                where: { userId },
                relations: ['user'],
            });
            if (!staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponseDto(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du personnel: ${message}`);
        }
    }
    async getStaffByMatricule(matricule) {
        try {
            const staff = await this.staffRepository.findOne({
                where: { matricule },
                relations: ['user'],
            });
            if (!staff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé');
            }
            return this.mapToStaffResponseDto(staff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du personnel: ${message}`);
        }
    }
    async getStaffByPosition(position) {
        try {
            const staff = await this.staffRepository.find({
                where: { position },
                relations: ['user'],
                order: { createdAt: 'DESC' },
            });
            return staff.map((staffMember) => this.mapToStaffResponseDto(staffMember));
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la récupération du personnel: ${message}`);
        }
    }
    async updateStaff(id, updateStaffDto) {
        try {
            await this.getStaffById(id);
            if (updateStaffDto.matricule) {
                const existingStaff = await this.staffRepository.findOne({
                    where: { matricule: updateStaffDto.matricule },
                });
                if (existingStaff && existingStaff.id !== id) {
                    throw new common_1.ConflictException('Un membre du personnel avec ce matricule existe déjà');
                }
            }
            const updateData = { ...updateStaffDto };
            if (updateStaffDto.hireDate) {
                updateData.hireDate = updateStaffDto.hireDate;
            }
            await this.staffRepository.update(id, updateData);
            const updatedStaff = await this.staffRepository.findOne({
                where: { id },
                relations: ['user'],
            });
            if (!updatedStaff) {
                throw new common_1.NotFoundException('Membre du personnel non trouvé après mise à jour');
            }
            return this.mapToStaffResponseDto(updatedStaff);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException ||
                error instanceof common_1.ConflictException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la mise à jour du personnel: ${message}`);
        }
    }
    async deleteStaff(id) {
        try {
            await this.getStaffById(id);
            await this.staffRepository.delete(id);
            return { message: 'Membre du personnel supprimé avec succès' };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            throw new Error(`Erreur lors de la suppression du personnel: ${message}`);
        }
    }
    mapToStaffResponseDto(staff) {
        return {
            id: staff.id,
            userId: staff.userId,
            matricule: staff.matricule,
            hireDate: staff.hireDate,
            position: staff.position,
            photo: staff.photo,
            maritalStatus: staff.maritalStatus,
            address: staff.address,
            emergencyContact: staff.emergencyContact,
            notes: staff.notes,
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            user: staff.user
                ? {
                    id: staff.user.id,
                    username: staff.user.username,
                    email: staff.user.email,
                    firstName: staff.user.firstName,
                    lastName: staff.user.lastName,
                    gender: staff.user.gender,
                    birthDate: staff.user.birthDate,
                    phone: staff.user.phone,
                    role: staff.user.role,
                    isActive: staff.user.isActive,
                    createdAt: staff.user.createdAt,
                    updatedAt: staff.user.updatedAt,
                }
                : undefined,
        };
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(staff_entity_1.Staff)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], StaffService);
//# sourceMappingURL=staff.service.js.map