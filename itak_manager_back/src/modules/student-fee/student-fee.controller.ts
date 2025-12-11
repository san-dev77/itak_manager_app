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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { StudentFeeService } from './student-fee.service';
import {
  CreateStudentFeeDto,
  UpdateStudentFeeDto,
  PayStudentFeeDto,
  StudentFeeResponseDto,
  StudentFeesSummaryDto,
} from './dto/student-fee.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('student-fees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('student-fees')
export class StudentFeeController {
  constructor(private readonly studentFeeService: StudentFeeService) {}

  @Post()
  @ApiOperation({ summary: 'Assigner des frais à un étudiant' })
  @ApiResponse({
    status: 201,
    description: 'Frais assignés avec succès',
    type: StudentFeeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant ou type de frais non trouvé',
  })
  @ApiResponse({
    status: 409,
    description: 'Des frais de ce type existent déjà pour cet étudiant',
  })
  async create(@Body() createStudentFeeDto: CreateStudentFeeDto) {
    return await this.studentFeeService.create(createStudentFeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les frais des étudiants' })
  @ApiResponse({
    status: 200,
    description: 'Liste des frais des étudiants',
    type: [StudentFeeResponseDto],
  })
  async findAll() {
    return await this.studentFeeService.findAll();
  }

  @Get('overdue')
  @ApiOperation({ summary: 'Récupérer tous les frais en retard' })
  @ApiResponse({
    status: 200,
    description: 'Liste des frais en retard',
    type: [StudentFeeResponseDto],
  })
  async findOverdue() {
    return await this.studentFeeService.findOverdueFees();
  }

  @Post('mark-overdue')
  @ApiOperation({ summary: 'Marquer les frais en retard' })
  @ApiResponse({
    status: 200,
    description: 'Frais en retard marqués avec succès',
  })
  async markOverdue() {
    await this.studentFeeService.markOverdueFees();
    return { message: 'Frais en retard marqués avec succès' };
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: "Récupérer les frais d'un étudiant" })
  @ApiResponse({
    status: 200,
    description: "Frais de l'étudiant",
    type: [StudentFeeResponseDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant non trouvé',
  })
  async findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string) {
    return await this.studentFeeService.findByStudent(studentId);
  }

  @Get('student/:studentId/summary')
  @ApiOperation({ summary: "Récupérer le résumé des frais d'un étudiant" })
  @ApiResponse({
    status: 200,
    description: "Résumé des frais de l'étudiant",
    type: StudentFeesSummaryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Étudiant non trouvé',
  })
  async getStudentSummary(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return await this.studentFeeService.getStudentFeesSummary(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer des frais par ID' })
  @ApiResponse({
    status: 200,
    description: 'Frais trouvés',
    type: StudentFeeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Frais non trouvés',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.studentFeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour des frais' })
  @ApiResponse({
    status: 200,
    description: 'Frais mis à jour avec succès',
    type: StudentFeeResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Frais non trouvés',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentFeeDto: UpdateStudentFeeDto,
  ) {
    return await this.studentFeeService.update(id, updateStudentFeeDto);
  }

  @Post(':id/pay')
  @ApiOperation({ summary: 'Effectuer un paiement sur des frais' })
  @ApiResponse({
    status: 200,
    description: 'Paiement effectué avec succès',
    type: StudentFeeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Montant du paiement invalide',
  })
  @ApiResponse({
    status: 404,
    description: 'Frais non trouvés',
  })
  async payFee(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() payStudentFeeDto: PayStudentFeeDto,
  ) {
    return await this.studentFeeService.payFee(id, payStudentFeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer des frais' })
  @ApiResponse({
    status: 200,
    description: 'Frais supprimés avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'Frais non trouvés',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.studentFeeService.remove(id);
    return { message: 'Frais supprimés avec succès' };
  }
}
