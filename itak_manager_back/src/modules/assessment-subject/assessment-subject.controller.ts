import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Query,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AssessmentSubjectService } from './assessment-subject.service';
import {
  CreateAssessmentSubjectDto,
  UpdateAssessmentSubjectDto,
  AssessmentSubjectResponseDto,
} from './dto/assessment-subject.dto';

@ApiTags('Assessment Subjects')
@Controller('assessment-subjects')
@ApiBearerAuth()
export class AssessmentSubjectController {
  constructor(
    private readonly assessmentSubjectService: AssessmentSubjectService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: "Créer un nouveau sujet d'évaluation avec fichier" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: "Sujet d'évaluation avec fichier",
    schema: {
      type: 'object',
      properties: {
        assessmentId: {
          type: 'string',
          format: 'uuid',
          description: "ID de l'évaluation",
        },
        fileType: {
          type: 'string',
          enum: ['pdf', 'doc', 'docx', 'odt'],
          description: 'Type de fichier',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Fichier du sujet',
        },
      },
      required: ['assessmentId', 'fileType', 'file'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sujet créé avec succès',
    type: AssessmentSubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides ou type de fichier incorrect',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation ou utilisateur non trouvé',
  })
  async create(
    @Body() createDto: CreateAssessmentSubjectDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<AssessmentSubjectResponseDto> {
    const uploadedByUserId = req.user?.id || req.user?.sub;
    return this.assessmentSubjectService.create(
      createDto,
      file,
      uploadedByUserId,
    );
  }

  @Get()
  @ApiOperation({ summary: "Récupérer tous les sujets d'évaluation" })
  @ApiQuery({
    name: 'assessmentId',
    required: false,
    description: "Filtrer par ID de l'évaluation",
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: "Filtrer par ID de l'utilisateur",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Liste des sujets récupérée avec succès',
    type: [AssessmentSubjectResponseDto],
  })
  async findAll(
    @Query('assessmentId') assessmentId?: string,
    @Query('userId') userId?: string,
  ): Promise<AssessmentSubjectResponseDto[]> {
    if (assessmentId) {
      return this.assessmentSubjectService.findByAssessment(assessmentId);
    }
    if (userId) {
      return this.assessmentSubjectService.findByUser(userId);
    }
    return this.assessmentSubjectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un sujet par son ID' })
  @ApiParam({
    name: 'id',
    description: 'ID du sujet',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sujet récupéré avec succès',
    type: AssessmentSubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sujet non trouvé',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AssessmentSubjectResponseDto> {
    return this.assessmentSubjectService.findOne(id);
  }

  @Get('assessment/:assessmentId')
  @ApiOperation({ summary: "Récupérer les sujets d'une évaluation" })
  @ApiParam({
    name: 'assessmentId',
    description: "ID de l'évaluation",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sujets de l'évaluation récupérés avec succès",
    type: [AssessmentSubjectResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Évaluation non trouvée',
  })
  async findByAssessment(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<AssessmentSubjectResponseDto[]> {
    return this.assessmentSubjectService.findByAssessment(assessmentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Récupérer les sujets uploadés par un utilisateur' })
  @ApiParam({
    name: 'userId',
    description: "ID de l'utilisateur",
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Sujets de l'utilisateur récupérés avec succès",
    type: [AssessmentSubjectResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Utilisateur non trouvé',
  })
  async findByUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<AssessmentSubjectResponseDto[]> {
    return this.assessmentSubjectService.findByUser(userId);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: "Mettre à jour un sujet d'évaluation" })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'ID du sujet',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    description: 'Mise à jour du sujet (optionnel avec nouveau fichier)',
    schema: {
      type: 'object',
      properties: {
        fileType: {
          type: 'string',
          enum: ['pdf', 'doc', 'docx', 'odt'],
          description: 'Type de fichier',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'Nouveau fichier (optionnel)',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sujet mis à jour avec succès',
    type: AssessmentSubjectResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Données invalides',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sujet non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Seul l'uploadeur peut modifier le fichier",
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateAssessmentSubjectDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<AssessmentSubjectResponseDto> {
    const userId = req.user?.id || req.user?.sub;
    return this.assessmentSubjectService.update(id, updateDto, file, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Supprimer un sujet d'évaluation" })
  @ApiParam({
    name: 'id',
    description: 'ID du sujet',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sujet supprimé avec succès',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sujet non trouvé',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Seul l'uploadeur peut supprimer le fichier",
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user?.id || req.user?.sub;
    return this.assessmentSubjectService.remove(id, userId);
  }
}
