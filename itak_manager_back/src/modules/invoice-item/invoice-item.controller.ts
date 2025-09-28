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
import { InvoiceItemService } from './invoice-item.service';
import {
  CreateInvoiceItemDto,
  UpdateInvoiceItemDto,
  InvoiceItemResponseDto,
} from './dto/invoice-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('invoice-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoice-items')
export class InvoiceItemController {
  constructor(private readonly invoiceItemService: InvoiceItemService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle ligne de facture' })
  @ApiResponse({
    status: 201,
    description: 'Ligne de facture créée avec succès',
    type: InvoiceItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Facture ou frais étudiant non trouvé',
  })
  async create(@Body() createInvoiceItemDto: CreateInvoiceItemDto) {
    return await this.invoiceItemService.create(createInvoiceItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les lignes de facture' })
  @ApiResponse({
    status: 200,
    description: 'Liste des lignes de facture',
    type: [InvoiceItemResponseDto],
  })
  async findAll() {
    return await this.invoiceItemService.findAll();
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({ summary: "Récupérer les lignes d'une facture" })
  @ApiResponse({
    status: 200,
    description: 'Lignes de la facture',
    type: [InvoiceItemResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async findByInvoice(@Param('invoiceId', ParseUUIDPipe) invoiceId: string) {
    return await this.invoiceItemService.findByInvoice(invoiceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une ligne de facture par ID' })
  @ApiResponse({
    status: 200,
    description: 'Ligne de facture trouvée',
    type: InvoiceItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ligne de facture non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.invoiceItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour une ligne de facture' })
  @ApiResponse({
    status: 200,
    description: 'Ligne de facture mise à jour avec succès',
    type: InvoiceItemResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Ligne de facture non trouvée',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceItemDto: UpdateInvoiceItemDto,
  ) {
    return await this.invoiceItemService.update(id, updateInvoiceItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une ligne de facture' })
  @ApiResponse({
    status: 200,
    description: 'Ligne de facture supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Ligne de facture non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.invoiceItemService.remove(id);
    return { message: 'Ligne de facture supprimée avec succès' };
  }
}
