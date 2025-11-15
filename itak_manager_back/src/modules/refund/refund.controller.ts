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
import { RefundService } from './refund.service';
import {
  CreateRefundDto,
  UpdateRefundDto,
  RefundResponseDto,
  RefundSummaryDto,
} from './dto/refund.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('refunds')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('refunds')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau remboursement' })
  @ApiResponse({
    status: 201,
    description: 'Remboursement créé avec succès',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Montant invalide ou paiement non éligible',
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement ou utilisateur non trouvé',
  })
  async create(@Body() createRefundDto: CreateRefundDto) {
    return await this.refundService.create(createRefundDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les remboursements' })
  @ApiResponse({
    status: 200,
    description: 'Liste des remboursements',
    type: [RefundResponseDto],
  })
  async findAll() {
    return await this.refundService.findAll();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Récupérer le résumé des remboursements' })
  @ApiResponse({
    status: 200,
    description: 'Résumé des remboursements',
    type: RefundSummaryDto,
  })
  async getSummary() {
    return await this.refundService.getRefundSummary();
  }

  @Get('payment/:paymentId')
  @ApiOperation({ summary: 'Récupérer les remboursements pour un paiement' })
  @ApiResponse({
    status: 200,
    description: 'Remboursements pour le paiement spécifié',
    type: [RefundResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Paiement non trouvé',
  })
  async findByPayment(@Param('paymentId', ParseUUIDPipe) paymentId: string) {
    return await this.refundService.findByPayment(paymentId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Récupérer les remboursements traités par un utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: "Remboursements traités par l'utilisateur",
    type: [RefundResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Utilisateur non trouvé',
  })
  async findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.refundService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un remboursement par ID' })
  @ApiResponse({
    status: 200,
    description: 'Remboursement trouvé',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Remboursement non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.refundService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un remboursement' })
  @ApiResponse({
    status: 200,
    description: 'Remboursement mis à jour avec succès',
    type: RefundResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Remboursement non trouvé',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRefundDto: UpdateRefundDto,
  ) {
    return await this.refundService.update(id, updateRefundDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un remboursement' })
  @ApiResponse({
    status: 200,
    description: 'Remboursement supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Remboursement non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.refundService.remove(id);
    return { message: 'Remboursement supprimé avec succès' };
  }
}
