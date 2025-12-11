import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../../entities/staff.entity';
import { User } from '../../entities/user.entity';
import {
  CreateStaffDto,
  StaffResponseDto,
  UpdateStaffDto,
} from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createStaff(createStaffDto: CreateStaffDto): Promise<StaffResponseDto> {
    try {
      console.log('📝 Création staff avec données:', createStaffDto);

      // Vérifier si l'utilisateur existe
      const user = await this.userRepository.findOne({
        where: { id: createStaffDto.userId },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      console.log('✅ Utilisateur trouvé:', user.id);

      // Générer un matricule automatiquement si non fourni
      let matricule = createStaffDto.matricule;
      if (!matricule) {
        // Générer un matricule unique basé sur le timestamp et un random
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        matricule = `STF-${timestamp}-${random}`;

        // Vérifier l'unicité
        let exists = await this.staffRepository.findOne({
          where: { matricule },
        });
        let attempts = 0;
        while (exists && attempts < 10) {
          const newRandom = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          matricule = `STF-${timestamp}-${newRandom}`;
          exists = await this.staffRepository.findOne({
            where: { matricule },
          });
          attempts++;
        }
      } else {
        // Vérifier si le matricule existe déjà
        const existingStaff = await this.staffRepository.findOne({
          where: { matricule: createStaffDto.matricule },
        });

        if (existingStaff) {
          throw new ConflictException(
            'Un membre du personnel avec ce matricule existe déjà',
          );
        }
      }

      // Vérifier si l'utilisateur est déjà du personnel administratif
      const staffExists = await this.staffRepository.findOne({
        where: { userId: createStaffDto.userId },
      });

      if (staffExists) {
        throw new ConflictException(
          'Cet utilisateur est déjà du personnel administratif',
        );
      }

      // Créer le membre du personnel
      const staffData = {
        ...createStaffDto,
        matricule: matricule,
        hireDate: createStaffDto.hireDate,
      };

      console.log('📦 Données staff à créer:', staffData);

      const staff = this.staffRepository.create(staffData);

      const savedStaff = await this.staffRepository.save(staff);
      console.log('✅ Staff créé avec succès:', savedStaff.id);

      // Récupérer le membre du personnel avec la relation user chargée
      const staffWithUser = await this.staffRepository.findOne({
        where: { id: savedStaff.id },
        relations: ['user'],
      });

      if (!staffWithUser) {
        throw new Error(
          'Erreur lors de la récupération du membre du personnel créé',
        );
      }

      return this.mapToStaffResponseDto(staffWithUser);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du personnel: ${message}`);
    }
  }

  async getAllStaff(): Promise<StaffResponseDto[]> {
    try {
      const staff = await this.staffRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });

      return staff.map((staffMember) =>
        this.mapToStaffResponseDto(staffMember),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du personnel: ${message}`,
      );
    }
  }

  async getStaffById(id: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponseDto(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du personnel: ${message}`,
      );
    }
  }

  async getStaffByUserId(userId: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { userId },
        relations: ['user'],
      });

      if (!staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponseDto(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du personnel: ${message}`,
      );
    }
  }

  async getStaffByMatricule(matricule: string): Promise<StaffResponseDto> {
    try {
      const staff = await this.staffRepository.findOne({
        where: { matricule },
        relations: ['user'],
      });

      if (!staff) {
        throw new NotFoundException('Membre du personnel non trouvé');
      }

      return this.mapToStaffResponseDto(staff);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du personnel: ${message}`,
      );
    }
  }

  async getStaffByPosition(position: string): Promise<StaffResponseDto[]> {
    try {
      const staff = await this.staffRepository.find({
        where: { position },
        relations: ['user'],
        order: { createdAt: 'DESC' },
      });

      return staff.map((staffMember) =>
        this.mapToStaffResponseDto(staffMember),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du personnel: ${message}`,
      );
    }
  }

  async updateStaff(
    id: string,
    updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    try {
      // Vérifier que le membre du personnel existe
      await this.getStaffById(id);

      // Si le matricule est modifié, vérifier qu'il n'existe pas déjà
      if (updateStaffDto.matricule) {
        const existingStaff = await this.staffRepository.findOne({
          where: { matricule: updateStaffDto.matricule },
        });

        if (existingStaff && existingStaff.id !== id) {
          throw new ConflictException(
            'Un membre du personnel avec ce matricule existe déjà',
          );
        }
      }

      // Mettre à jour le membre du personnel
      const updateData = { ...updateStaffDto };
      if (updateStaffDto.hireDate) {
        updateData.hireDate = updateStaffDto.hireDate;
      }

      await this.staffRepository.update(id, updateData);

      // Récupérer le membre du personnel mis à jour
      const updatedStaff = await this.staffRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!updatedStaff) {
        throw new NotFoundException(
          'Membre du personnel non trouvé après mise à jour',
        );
      }

      return this.mapToStaffResponseDto(updatedStaff);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la mise à jour du personnel: ${message}`);
    }
  }

  async deleteStaff(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que le membre du personnel existe
      await this.getStaffById(id);

      await this.staffRepository.delete(id);

      return { message: 'Membre du personnel supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression du personnel: ${message}`);
    }
  }

  private mapToStaffResponseDto(staff: Staff): StaffResponseDto {
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
}
