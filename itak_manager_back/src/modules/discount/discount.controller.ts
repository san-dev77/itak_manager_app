import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import {
  CreateDiscountDto,
  UpdateDiscountDto,
  DiscountResponseDto,
} from './dto/discount.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Créer une nouvelle réduction' })
  @ApiResponse({
    status: 201,
    description: 'Réduction créée avec succès',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Montant invalide ou données incorretes',
  })
  @ApiResponse({
    status: 404,
    description: 'Frais étudiant ou utilisateur non trouvé',
  })
  async create(@Body() createDiscountDto: CreateDiscountDto) {
    return await this.discountService.create(createDiscountDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les réductions' })
  @ApiResponse({
    status: 200,
    description: 'Liste des réductions',
    type: [DiscountResponseDto],
  })
  async findAll() {
    return await this.discountService.findAll();
  }

  @Get('student-fee/:studentFeeId')
  @Public()
  @ApiOperation({
    summary: 'Récupérer les réductions pour des frais spécifiques',
  })
  @ApiResponse({
    status: 200,
    description: 'Réductions pour les frais spécifiés',
    type: [DiscountResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Frais étudiant non trouvé',
  })
  async findByStudentFee(
    @Param('studentFeeId', ParseUUIDPipe) studentFeeId: string,
  ) {
    return await this.discountService.findByStudentFee(studentFeeId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une réduction par ID' })
  @ApiResponse({
    status: 200,
    description: 'Réduction trouvée',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Réduction non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.discountService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Mettre à jour une réduction' })
  @ApiResponse({
    status: 200,
    description: 'Réduction mise à jour avec succès',
    type: DiscountResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Réduction non trouvée',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ) {
    return await this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Supprimer une réduction' })
  @ApiResponse({
    status: 200,
    description: 'Réduction supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Réduction non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.discountService.remove(id);
    return { message: 'Réduction supprimée avec succès' };
  }
}
