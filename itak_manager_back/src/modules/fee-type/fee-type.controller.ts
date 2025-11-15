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
import { FeeTypeService } from './fee-type.service';
import {
  CreateFeeTypeDto,
  UpdateFeeTypeDto,
  FeeTypeResponseDto,
} from './dto/fee-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('fee-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fee-types')
export class FeeTypeController {
  constructor(private readonly feeTypeService: FeeTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau type de frais' })
  @ApiResponse({
    status: 201,
    description: 'Type de frais créé avec succès',
    type: FeeTypeResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Un type de frais avec ce nom existe déjà',
  })
  async create(@Body() createFeeTypeDto: CreateFeeTypeDto) {
    return await this.feeTypeService.create(createFeeTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les types de frais' })
  @ApiResponse({
    status: 200,
    description: 'Liste des types de frais',
    type: [FeeTypeResponseDto],
  })
  async findAll() {
    return await this.feeTypeService.findAll();
  }

  @Get('recurring')
  @ApiOperation({ summary: 'Récupérer tous les types de frais récurrents' })
  @ApiResponse({
    status: 200,
    description: 'Liste des types de frais récurrents',
    type: [FeeTypeResponseDto],
  })
  async findRecurring() {
    return await this.feeTypeService.findRecurringFeeTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un type de frais par ID' })
  @ApiResponse({
    status: 200,
    description: 'Type de frais trouvé',
    type: FeeTypeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Type de frais non trouvé',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.feeTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un type de frais' })
  @ApiResponse({
    status: 200,
    description: 'Type de frais mis à jour avec succès',
    type: FeeTypeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Type de frais non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Un type de frais avec ce nom existe déjà',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFeeTypeDto: UpdateFeeTypeDto,
  ) {
    return await this.feeTypeService.update(id, updateFeeTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un type de frais' })
  @ApiResponse({
    status: 200,
    description: 'Type de frais supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Type de frais non trouvé',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.feeTypeService.remove(id);
    return { message: 'Type de frais supprimé avec succès' };
  }
}
