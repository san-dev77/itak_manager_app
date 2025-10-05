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
import { PaymentService } from './payment.service';
import {
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentResponseDto,
  PaymentSummaryDto,
} from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Enregistrer un nouveau paiement' })
  @ApiResponse({
    status: 201,
    description: 'Paiement enregistré avec succès',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Montant invalide ou données incorretes',
  })
  @ApiResponse({
    status: 404,
    description: 'Frais étudiant ou utilisateur non trouvé',
  })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.create(createPaymentDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer tous les paiements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des paiements',
    type: [PaymentResponseDto],
  })
  async findAll() {
    return await this.paymentService.findAll();
  }

  @Get('summary')
  @Public()
  @ApiOperation({ summary: 'Récupérer le résumé des paiements' })
  @ApiResponse({
    status: 200,
    description: 'Résumé des paiements',
    type: PaymentSummaryDto,
  })
  async getSummary() {
    return await this.paymentService.getPaymentSummary();
  }

  @Get('student-fee/:studentFeeId')
  @Public()
  @ApiOperation({
    summary: 'Récupérer les paiements pour des frais spécifiques',
  })
  @ApiResponse({
    status: 200,
    description: 'Paiements pour les frais spécifiés',
    type: [PaymentResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Frais étudiant non trouvé',
  })
  async findByStudentFee(
    @Param('studentFeeId', ParseUUIDPipe) studentFeeId: string,
  ) {
    return await this.paymentService.findByStudentFee(studentFeeId);
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({ summary: 'Récupérer les paiements reçus par un utilisateur' })
  @ApiResponse({
    status: 200,
    description: "Paiements reçus par l'utilisateur",
    type: [PaymentResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.paymentService.findByUser(userId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer un paiement par ID' })
  @ApiResponse({
    status: 200,
    description: 'Paiement trouvé',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.paymentService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Mettre à jour un paiement' })
  @ApiResponse({
    status: 200,
    description: 'Paiement mis à jour avec succès',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return await this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Supprimer un paiement' })
  @ApiResponse({
    status: 200,
    description: 'Paiement supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.paymentService.remove(id);
    return { message: 'Paiement supprimé avec succès' };
  }
}
