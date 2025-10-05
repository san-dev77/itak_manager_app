import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolYear } from '../../entities/school-year.entity';
import { Term } from '../../entities/term.entity';
import {
  CreateSchoolYearDto,
  UpdateSchoolYearDto,
  SchoolYearResponseDto,
} from './dto/school-year.dto';

@Injectable()
export class SchoolYearService {
  constructor(
    @InjectRepository(SchoolYear)
    private schoolYearRepository: Repository<SchoolYear>,
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
  ) {}

  async createSchoolYear(
    createSchoolYearDto: CreateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    try {
      // Vérifier que les dates sont cohérentes
      const startDate = new Date(createSchoolYearDto.startDate);
      const endDate = new Date(createSchoolYearDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException(
          'La date de début doit être antérieure à la date de fin',
        );
      }

      // Vérifier l'unicité du nom
      const existingSchoolYear = await this.schoolYearRepository.findOne({
        where: { name: createSchoolYearDto.name },
      });

      if (existingSchoolYear) {
        throw new ConflictException(
          'Une année scolaire avec ce nom existe déjà',
        );
      }

      // Si cette année est marquée comme active, désactiver les autres
      if (createSchoolYearDto.isActive) {
        const activeSchoolYears = await this.schoolYearRepository.find({
          where: { isActive: true },
        });

        if (activeSchoolYears.length > 0) {
          await Promise.all(
            activeSchoolYears.map((schoolYear) =>
              this.schoolYearRepository.update(schoolYear.id, {
                isActive: false,
              }),
            ),
          );
        }
      }

      const schoolYear = this.schoolYearRepository.create({
        name: createSchoolYearDto.name,
        startDate: startDate,
        endDate: endDate,
        isActive: createSchoolYearDto.isActive || false,
      });

      const savedSchoolYear = await this.schoolYearRepository.save(schoolYear);

      // Récupérer l'année scolaire avec les relations chargées
      const schoolYearWithRelations = await this.schoolYearRepository.findOne({
        where: { id: savedSchoolYear.id },
        relations: ['terms'],
      });

      if (!schoolYearWithRelations) {
        throw new Error(
          "Erreur lors de la récupération de l'année scolaire créée",
        );
      }

      return this.mapToSchoolYearResponseDto(schoolYearWithRelations);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la création de l'année scolaire: ${message}`,
      );
    }
  }

  async getAllSchoolYears(): Promise<SchoolYearResponseDto[]> {
    try {
      const schoolYears = await this.schoolYearRepository.find({
        relations: ['terms'],
        order: { startDate: 'DESC' },
      });

      return schoolYears.map((schoolYear) =>
        this.mapToSchoolYearResponseDto(schoolYear),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des années scolaires: ${message}`,
      );
    }
  }

  async getSchoolYearById(id: string): Promise<SchoolYearResponseDto> {
    try {
      const schoolYear = await this.schoolYearRepository.findOne({
        where: { id },
        relations: ['terms'],
      });

      if (!schoolYear) {
        throw new NotFoundException('Année scolaire non trouvée');
      }

      return this.mapToSchoolYearResponseDto(schoolYear);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'année scolaire: ${message}`,
      );
    }
  }

  async getActiveSchoolYear(): Promise<SchoolYearResponseDto> {
    try {
      const activeSchoolYear = await this.schoolYearRepository.findOne({
        where: { isActive: true },
        relations: ['terms'],
      });

      if (!activeSchoolYear) {
        throw new NotFoundException('Aucune année scolaire active trouvée');
      }

      return this.mapToSchoolYearResponseDto(activeSchoolYear);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'année scolaire active: ${message}`,
      );
    }
  }

  async updateSchoolYear(
    id: string,
    updateSchoolYearDto: UpdateSchoolYearDto,
  ): Promise<SchoolYearResponseDto> {
    try {
      const schoolYear = await this.schoolYearRepository.findOne({
        where: { id },
      });

      if (!schoolYear) {
        throw new NotFoundException('Année scolaire non trouvée');
      }

      // Vérifier les dates si elles sont fournies
      if (updateSchoolYearDto.startDate && updateSchoolYearDto.endDate) {
        const startDate = new Date(updateSchoolYearDto.startDate);
        const endDate = new Date(updateSchoolYearDto.endDate);

        if (startDate >= endDate) {
          throw new BadRequestException(
            'La date de début doit être antérieure à la date de fin',
          );
        }
      }

      // Vérifier l'unicité du nom si modifié
      if (
        updateSchoolYearDto.name &&
        updateSchoolYearDto.name !== schoolYear.name
      ) {
        const existingSchoolYear = await this.schoolYearRepository.findOne({
          where: { name: updateSchoolYearDto.name },
        });

        if (existingSchoolYear) {
          throw new ConflictException(
            'Une année scolaire avec ce nom existe déjà',
          );
        }
      }

      // Si cette année est marquée comme active, désactiver les autres
      if (updateSchoolYearDto.isActive && !schoolYear.isActive) {
        const activeSchoolYears = await this.schoolYearRepository.find({
          where: { isActive: true },
        });

        if (activeSchoolYears.length > 0) {
          await Promise.all(
            activeSchoolYears
              .filter((sy) => sy.id !== id)
              .map((sy) =>
                this.schoolYearRepository.update(sy.id, { isActive: false }),
              ),
          );
        }
      }

      // Mettre à jour les champs
      Object.assign(schoolYear, {
        ...updateSchoolYearDto,
        startDate: updateSchoolYearDto.startDate
          ? new Date(updateSchoolYearDto.startDate)
          : schoolYear.startDate,
        endDate: updateSchoolYearDto.endDate
          ? new Date(updateSchoolYearDto.endDate)
          : schoolYear.endDate,
      });

      const updatedSchoolYear =
        await this.schoolYearRepository.save(schoolYear);
      return this.mapToSchoolYearResponseDto(updatedSchoolYear);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la mise à jour de l'année scolaire: ${message}`,
      );
    }
  }

  async deleteSchoolYear(id: string): Promise<void> {
    try {
      const schoolYear = await this.schoolYearRepository.findOne({
        where: { id },
        relations: ['terms'],
      });

      if (!schoolYear) {
        throw new NotFoundException('Année scolaire non trouvée');
      }

      // Vérifier s'il y a des trimestres associés
      if (schoolYear.terms && schoolYear.terms.length > 0) {
        throw new BadRequestException(
          'Impossible de supprimer une année scolaire qui contient des trimestres',
        );
      }

      await this.schoolYearRepository.remove(schoolYear);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'année scolaire: ${message}`,
      );
    }
  }

  async setActiveSchoolYear(id: string): Promise<SchoolYearResponseDto> {
    try {
      const schoolYear = await this.schoolYearRepository.findOne({
        where: { id },
      });

      if (!schoolYear) {
        throw new NotFoundException('Année scolaire non trouvée');
      }

      // Désactiver toutes les autres années
      const activeSchoolYears = await this.schoolYearRepository.find({
        where: { isActive: true },
      });

      if (activeSchoolYears.length > 0) {
        await Promise.all(
          activeSchoolYears.map((sy) =>
            this.schoolYearRepository.update(sy.id, { isActive: false }),
          ),
        );
      }

      // Activer l'année sélectionnée
      schoolYear.isActive = true;
      const updatedSchoolYear =
        await this.schoolYearRepository.save(schoolYear);

      return this.mapToSchoolYearResponseDto(updatedSchoolYear);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de l'activation de l'année scolaire: ${message}`,
      );
    }
  }

  private mapToSchoolYearResponseDto(
    schoolYear: SchoolYear,
  ): SchoolYearResponseDto {
    return {
      id: schoolYear.id,
      name: schoolYear.name,
      startDate: schoolYear.startDate,
      endDate: schoolYear.endDate,
      isActive: schoolYear.isActive,
      createdAt: schoolYear.createdAt,
      updatedAt: schoolYear.updatedAt,
      terms: schoolYear.terms?.map((term) => ({
        id: term.id,
        schoolYearId: term.schoolYearId,
        name: term.name,
        startDate: term.startDate,
        endDate: term.endDate,
        isActive: term.isActive,
        orderNumber: term.orderNumber,
        createdAt: term.createdAt,
        updatedAt: term.updatedAt,
      })),
    };
  }
}
