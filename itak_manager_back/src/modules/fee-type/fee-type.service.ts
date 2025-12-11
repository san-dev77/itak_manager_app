import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeType } from '../../entities/fee-type.entity';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from './dto/fee-type.dto';

@Injectable()
export class FeeTypeService {
  constructor(
    @InjectRepository(FeeType)
    private readonly feeTypeRepository: Repository<FeeType>,
  ) {}

  async create(createFeeTypeDto: CreateFeeTypeDto): Promise<FeeType> {
    // Vérifier si un type de frais avec le même nom existe déjà
    const existingFeeType = await this.feeTypeRepository.findOne({
      where: { name: createFeeTypeDto.name },
    });

    if (existingFeeType) {
      throw new ConflictException(
        `Un type de frais avec le nom "${createFeeTypeDto.name}" existe déjà`,
      );
    }

    const feeType = this.feeTypeRepository.create(createFeeTypeDto);
    return await this.feeTypeRepository.save(feeType);
  }

  async findAll(): Promise<FeeType[]> {
    return await this.feeTypeRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<FeeType> {
    const feeType = await this.feeTypeRepository.findOne({
      where: { id },
      relations: ['studentFees'],
    });

    if (!feeType) {
      throw new NotFoundException(`Type de frais avec l'ID ${id} non trouvé`);
    }

    return feeType;
  }

  async update(
    id: string,
    updateFeeTypeDto: UpdateFeeTypeDto,
  ): Promise<FeeType> {
    const feeType = await this.findOne(id);

    // Vérifier si un autre type de frais avec le même nom existe
    if (updateFeeTypeDto.name && updateFeeTypeDto.name !== feeType.name) {
      const existingFeeType = await this.feeTypeRepository.findOne({
        where: { name: updateFeeTypeDto.name },
      });

      if (existingFeeType) {
        throw new ConflictException(
          `Un type de frais avec le nom "${updateFeeTypeDto.name}" existe déjà`,
        );
      }
    }

    Object.assign(feeType, updateFeeTypeDto);
    return await this.feeTypeRepository.save(feeType);
  }

  async remove(id: string): Promise<void> {
    const feeType = await this.findOne(id);
    await this.feeTypeRepository.remove(feeType);
  }

  async findByName(name: string): Promise<FeeType | null> {
    return await this.feeTypeRepository.findOne({
      where: { name },
    });
  }

  async findRecurringFeeTypes(): Promise<FeeType[]> {
    return await this.feeTypeRepository.find({
      where: { isRecurring: true },
      order: { name: 'ASC' },
    });
  }
}
