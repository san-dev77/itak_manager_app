import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from '../../entities/discount.entity';
import { StudentFee } from '../../entities/student-fee.entity';
import { User } from '../../entities/user.entity';
import { CreateDiscountDto, UpdateDiscountDto } from './dto/discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
    @InjectRepository(StudentFee)
    private readonly studentFeeRepository: Repository<StudentFee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<Discount> {
    // Vérifier que les frais étudiants existent
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: createDiscountDto.studentFeeId },
    });
    if (!studentFee) {
      throw new NotFoundException(
        `Frais étudiant avec l'ID ${createDiscountDto.studentFeeId} non trouvé`,
      );
    }

    // Vérifier que l'utilisateur approbateur existe
    const approvedByUser = await this.userRepository.findOne({
      where: { id: createDiscountDto.approvedBy },
    });
    if (!approvedByUser) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${createDiscountDto.approvedBy} non trouvé`,
      );
    }

    // Vérifier que le montant de la réduction ne dépasse pas le montant assigné
    if (createDiscountDto.amount > Number(studentFee.amountAssigned)) {
      throw new BadRequestException(
        `Le montant de la réduction (${createDiscountDto.amount}) ne peut pas dépasser le montant assigné (${studentFee.amountAssigned})`,
      );
    }

    const discount = this.discountRepository.create(createDiscountDto);
    return await this.discountRepository.save(discount);
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository.find({
      relations: ['studentFee', 'approvedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      relations: ['studentFee', 'approvedByUser'],
    });

    if (!discount) {
      throw new NotFoundException(`Réduction avec l'ID ${id} non trouvée`);
    }

    return discount;
  }

  async findByStudentFee(studentFeeId: string): Promise<Discount[]> {
    const studentFee = await this.studentFeeRepository.findOne({
      where: { id: studentFeeId },
    });
    if (!studentFee) {
      throw new NotFoundException(
        `Frais étudiant avec l'ID ${studentFeeId} non trouvé`,
      );
    }

    return await this.discountRepository.find({
      where: { studentFeeId },
      relations: ['approvedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount> {
    const discount = await this.findOne(id);

    Object.assign(discount, updateDiscountDto);
    return await this.discountRepository.save(discount);
  }

  async remove(id: string): Promise<void> {
    const discount = await this.findOne(id);
    await this.discountRepository.remove(discount);
  }
}
