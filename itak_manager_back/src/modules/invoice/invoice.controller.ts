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
import { InvoiceService } from './invoice.service';
import {
  CreateInvoiceDto,
  UpdateInvoiceDto,
  InvoiceResponseDto,
} from './dto/invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Créer une nouvelle facture' })
  @ApiResponse({
    status: 201,
    description: 'Facture créée avec succès',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Numéro de facture déjà existant',
  })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer toutes les factures' })
  @ApiResponse({
    status: 200,
    description: 'Liste des factures',
    type: [InvoiceResponseDto],
  })
  async findAll() {
    return await this.invoiceService.findAll();
  }

  @Get('generate-number')
  @Public()
  @ApiOperation({ summary: 'Générer un nouveau numéro de facture' })
  @ApiResponse({
    status: 200,
    description: 'Numéro de facture généré',
  })
  async generateInvoiceNumber() {
    const invoiceNumber = await this.invoiceService.generateInvoiceNumber();
    return { invoiceNumber };
  }

  @Get('student/:studentId')
  @Public()
  @ApiOperation({ summary: "Récupérer les factures d'un étudiant" })
  @ApiResponse({
    status: 200,
    description: "Factures de l'étudiant",
    type: [InvoiceResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant non trouvé',
  })
  async findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.invoiceService.findByStudent(studentId);
  }

  @Get('number/:invoiceNumber')
  @Public()
  @ApiOperation({ summary: 'Récupérer une facture par son numéro' })
  @ApiResponse({
    status: 200,
    description: 'Facture trouvée',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    return await this.invoiceService.findByInvoiceNumber(invoiceNumber);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Récupérer une facture par ID' })
  @ApiResponse({
    status: 200,
    description: 'Facture trouvée',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.invoiceService.findOne(id);
  }

  @Patch(':id')
  @Public()
  @ApiOperation({ summary: 'Mettre à jour une facture' })
  @ApiResponse({
    status: 200,
    description: 'Facture mise à jour avec succès',
    type: InvoiceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  @ApiResponse({
    status: 409,
    description: 'Numéro de facture déjà existant',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    return await this.invoiceService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @Public()
  @ApiOperation({ summary: 'Supprimer une facture' })
  @ApiResponse({
    status: 200,
    description: 'Facture supprimée avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Facture non trouvée',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.invoiceService.remove(id);
    return { message: 'Facture supprimée avec succès' };
  }
}
