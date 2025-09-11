import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Term } from '../../entities/term.entity';
import { SchoolYear } from '../../entities/school-year.entity';
import {
  CreateTermDto,
  UpdateTermDto,
  TermResponseDto,
} from './dto/term.dto';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private termRepository: Repository<Term>,
    @InjectRepository(SchoolYear)
    private schoolYearRepository: Repository<SchoolYear>,
  ) {}

  async createTerm(createTermDto: CreateTermDto): Promise<TermResponseDto> {
    try {
      // Vérifier que l'année scolaire existe
      const schoolYear = await this.schoolYearRepository.findOne({
        where: { id: createTermDto.schoolYearId },
      });

      if (!schoolYear) {
        throw new NotFoundException('Année scolaire non trouvée');
      }

      // Vérifier que les dates sont cohérentes
      const startDate = new Date(createTermDto.startDate);
      const endDate = new Date(createTermDto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException(
          'La date de début doit être antérieure à la date de fin',
        );
      }

      // Vérifier que les dates sont dans la période de l'année scolaire
      if (startDate < schoolYear.startDate || endDate > schoolYear.endDate) {
        throw new BadRequestException(
          'Les dates du trimestre doivent être comprises dans la période de l\'année scolaire',
        );
      }

      // Vérifier l'unicité du nom dans la même année scolaire
      const existingTerm = await this.termRepository.findOne({
        where: {
          schoolYearId: createTermDto.schoolYearId,
          name: createTermDto.name,
        },
      });

      if (existingTerm) {
        throw new ConflictException(
          'Un trimestre avec ce nom existe déjà dans cette année scolaire',
        );
      }

      // Déterminer le numéro d'ordre automatiquement si non fourni
      let orderNumber = createTermDto.orderNumber;
      if (!orderNumber) {
        const lastTerm = await this.termRepository.findOne({
          where: { schoolYearId: createTermDto.schoolYearId },
          order: { orderNumber: 'DESC' },
        });
        orderNumber = lastTerm ? lastTerm.orderNumber + 1 : 1;
      }

      // Si ce trimestre est marqué comme actif, désactiver les autres de la même année
      if (createTermDto.isActive) {
        await this.termRepository.update(
          { schoolYearId: createTermDto.schoolYearId },
          { isActive: false },
        );
      }

      const term = this.termRepository.create({
        schoolYearId: createTermDto.schoolYearId,
        name: createTermDto.name,
        startDate: startDate,
        endDate: endDate,
        isActive: createTermDto.isActive || false,
        orderNumber: orderNumber,
      });

      const savedTerm = await this.termRepository.save(term);
      return this.mapToTermResponseDto(savedTerm);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la création du trimestre: ${message}`);
    }
  }

  async getAllTerms(): Promise<TermResponseDto[]> {
    try {
      const terms = await this.termRepository.find({
        relations: ['schoolYear'],
        order: { orderNumber: 'ASC' },
      });

      return terms.map((term) => this.mapToTermResponseDto(term));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des trimestres: ${message}`,
      );
    }
  }

  async getTermById(id: string): Promise<TermResponseDto> {
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: ['schoolYear'],
      });

      if (!term) {
        throw new NotFoundException('Trimestre non trouvé');
      }

      return this.mapToTermResponseDto(term);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du trimestre: ${message}`,
      );
    }
  }

  async getTermsBySchoolYear(schoolYearId: string): Promise<TermResponseDto[]> {
    try {
      const terms = await this.termRepository.find({
        where: { schoolYearId },
        relations: ['schoolYear'],
        order: { orderNumber: 'ASC' },
      });

      return terms.map((term) => this.mapToTermResponseDto(term));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des trimestres: ${message}`,
      );
    }
  }

  async getActiveTerm(): Promise<TermResponseDto> {
    try {
      const activeTerm = await this.termRepository.findOne({
        where: { isActive: true },
        relations: ['schoolYear'],
      });

      if (!activeTerm) {
        throw new NotFoundException('Aucun trimestre actif trouvé');
      }

      return this.mapToTermResponseDto(activeTerm);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération du trimestre actif: ${message}`,
      );
    }
  }

  async updateTerm(
    id: string,
    updateTermDto: UpdateTermDto,
  ): Promise<TermResponseDto> {
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: ['schoolYear'],
      });

      if (!term) {
        throw new NotFoundException('Trimestre non trouvé');
      }

      // Vérifier l'année scolaire si elle est modifiée
      if (updateTermDto.schoolYearId && updateTermDto.schoolYearId !== term.schoolYearId) {
        const schoolYear = await this.schoolYearRepository.findOne({
          where: { id: updateTermDto.schoolYearId },
        });

        if (!schoolYear) {
          throw new NotFoundException('Année scolaire non trouvée');
        }
      }

      // Vérifier les dates si elles sont fournies
      if (updateTermDto.startDate && updateTermDto.endDate) {
        const startDate = new Date(updateTermDto.startDate);
        const endDate = new Date(updateTermDto.endDate);

        if (startDate >= endDate) {
          throw new BadRequestException(
            'La date de début doit être antérieure à la date de fin',
          );
        }

        // Vérifier que les dates sont dans la période de l'année scolaire
        const schoolYear = term.schoolYear;
        if (startDate < schoolYear.startDate || endDate > schoolYear.endDate) {
          throw new BadRequestException(
            'Les dates du trimestre doivent être comprises dans la période de l\'année scolaire',
          );
        }
      }

      // Vérifier l'unicité du nom si modifié
      if (updateTermDto.name && updateTermDto.name !== term.name) {
        const existingTerm = await this.termRepository.findOne({
          where: {
            schoolYearId: term.schoolYearId,
            name: updateTermDto.name,
          },
        });

        if (existingTerm) {
          throw new ConflictException(
            'Un trimestre avec ce nom existe déjà dans cette année scolaire',
          );
        }
      }

      // Si ce trimestre est marqué comme actif, désactiver les autres
      if (updateTermDto.isActive && !term.isActive) {
        await this.termRepository.update(
          { schoolYearId: term.schoolYearId },
          { isActive: false },
        );
      }

      // Mettre à jour les champs
      Object.assign(term, {
        ...updateTermDto,
        startDate: updateTermDto.startDate
          ? new Date(updateTermDto.startDate)
          : term.startDate,
        endDate: updateTermDto.endDate
          ? new Date(updateTermDto.endDate)
          : term.endDate,
      });

      const updatedTerm = await this.termRepository.save(term);
      return this.mapToTermResponseDto(updatedTerm);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la mise à jour du trimestre: ${message}`,
      );
    }
  }

  async deleteTerm(id: string): Promise<void> {
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: ['assessments'],
      });

      if (!term) {
        throw new NotFoundException('Trimestre non trouvé');
      }

      // Vérifier s'il y a des évaluations associées
      if (term.assessments && term.assessments.length > 0) {
        throw new BadRequestException(
          'Impossible de supprimer un trimestre qui contient des évaluations',
        );
      }

      await this.termRepository.remove(term);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(`Erreur lors de la suppression du trimestre: ${message}`);
    }
  }

  async setActiveTerm(id: string): Promise<TermResponseDto> {
    try {
      const term = await this.termRepository.findOne({
        where: { id },
        relations: ['schoolYear'],
      });

      if (!term) {
        throw new NotFoundException('Trimestre non trouvé');
      }

      // Désactiver tous les autres trimestres de la même année scolaire
      await this.termRepository.update(
        { schoolYearId: term.schoolYearId },
        { isActive: false },
      );

      // Activer le trimestre sélectionné
      term.isActive = true;
      const updatedTerm = await this.termRepository.save(term);

      return this.mapToTermResponseDto(updatedTerm);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de l'activation du trimestre: ${message}`,
      );
    }
  }

  private mapToTermResponseDto(term: Term): TermResponseDto {
    return {
      id: term.id,
      schoolYearId: term.schoolYearId,
      name: term.name,
      startDate: term.startDate,
      endDate: term.endDate,
      isActive: term.isActive,
      orderNumber: term.orderNumber,
      createdAt: term.createdAt,
      updatedAt: term.updatedAt,
      schoolYear: term.schoolYear
        ? {
            id: term.schoolYear.id,
            name: term.schoolYear.name,
            startDate: term.schoolYear.startDate,
            endDate: term.schoolYear.endDate,
            isActive: term.schoolYear.isActive,
            createdAt: term.schoolYear.createdAt,
            updatedAt: term.schoolYear.updatedAt,
          }
        : undefined,
    };
  }
}
