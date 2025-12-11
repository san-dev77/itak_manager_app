import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AssessmentSubject,
  FileType,
} from '../../entities/assessment-subject.entity';
import { Assessment } from '../../entities/assessment.entity';
import { User } from '../../entities/user.entity';
import {
  FileUploadService,
  UploadedFile,
} from '../../services/file-upload.service';
import {
  CreateAssessmentSubjectDto,
  UpdateAssessmentSubjectDto,
  AssessmentSubjectResponseDto,
} from './dto/assessment-subject.dto';

@Injectable()
export class AssessmentSubjectService {
  constructor(
    @InjectRepository(AssessmentSubject)
    private readonly assessmentSubjectRepository: Repository<AssessmentSubject>,
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async create(
    createDto: CreateAssessmentSubjectDto,
    file: Express.Multer.File,
    uploadedByUserId: string,
  ): Promise<AssessmentSubjectResponseDto> {
    const { assessmentId, fileType } = createDto;

    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: uploadedByUserId },
    });

    if (!user) {
      throw new NotFoundException(
        `Utilisateur avec l'ID ${uploadedByUserId} non trouvé`,
      );
    }

    // Validate file type matches the declared type
    const detectedFileType = this.fileUploadService.getFileTypeFromMimeType(
      file.mimetype,
    );
    if (detectedFileType !== fileType) {
      throw new BadRequestException(
        `Le type de fichier déclaré (${fileType}) ne correspond pas au fichier uploadé (${detectedFileType})`,
      );
    }

    // Validate it's a document file
    if (!this.fileUploadService.isDocumentFile(file.mimetype)) {
      throw new BadRequestException(
        "Seuls les documents (PDF, DOC, DOCX, ODT) sont autorisés pour les sujets d'évaluation",
      );
    }

    // Upload file
    const uploadedFile: UploadedFile = await this.fileUploadService.uploadFile(
      file,
      'assessment-subjects',
    );

    // Create assessment subject
    const assessmentSubject = this.assessmentSubjectRepository.create({
      assessmentId,
      fileUrl: uploadedFile.url,
      fileType,
      uploadedBy: uploadedByUserId,
    });

    const savedSubject =
      await this.assessmentSubjectRepository.save(assessmentSubject);

    // Load relations for response
    const subjectWithRelations = await this.assessmentSubjectRepository.findOne(
      {
        where: { id: savedSubject.id },
        relations: ['assessment', 'uploadedByUser'],
      },
    );

    if (!subjectWithRelations) {
      throw new NotFoundException(
        'Sujet créé mais non trouvé lors du rechargement',
      );
    }

    return this.mapToAssessmentSubjectResponseDto(
      subjectWithRelations,
      uploadedFile,
    );
  }

  async findAll(): Promise<AssessmentSubjectResponseDto[]> {
    const subjects = await this.assessmentSubjectRepository.find({
      relations: ['assessment', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });

    return subjects.map((subject) =>
      this.mapToAssessmentSubjectResponseDto(subject),
    );
  }

  async findOne(id: string): Promise<AssessmentSubjectResponseDto> {
    const subject = await this.assessmentSubjectRepository.findOne({
      where: { id },
      relations: ['assessment', 'uploadedByUser'],
    });

    if (!subject) {
      throw new NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
    }

    return this.mapToAssessmentSubjectResponseDto(subject);
  }

  async findByAssessment(
    assessmentId: string,
  ): Promise<AssessmentSubjectResponseDto[]> {
    // Verify assessment exists
    const assessment = await this.assessmentRepository.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException(
        `Évaluation avec l'ID ${assessmentId} non trouvée`,
      );
    }

    const subjects = await this.assessmentSubjectRepository.find({
      where: { assessmentId },
      relations: ['assessment', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });

    return subjects.map((subject) =>
      this.mapToAssessmentSubjectResponseDto(subject),
    );
  }

  async findByUser(userId: string): Promise<AssessmentSubjectResponseDto[]> {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${userId} non trouvé`);
    }

    const subjects = await this.assessmentSubjectRepository.find({
      where: { uploadedBy: userId },
      relations: ['assessment', 'uploadedByUser'],
      order: { createdAt: 'DESC' },
    });

    return subjects.map((subject) =>
      this.mapToAssessmentSubjectResponseDto(subject),
    );
  }

  async update(
    id: string,
    updateDto: UpdateAssessmentSubjectDto,
    file?: Express.Multer.File,
    userId?: string,
  ): Promise<AssessmentSubjectResponseDto> {
    const subject = await this.assessmentSubjectRepository.findOne({
      where: { id },
      relations: ['uploadedByUser'],
    });

    if (!subject) {
      throw new NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
    }

    // Check if user can update (only the uploader can update)
    if (userId && subject.uploadedBy !== userId) {
      throw new ForbiddenException(
        "Seul l'utilisateur qui a uploadé le fichier peut le modifier",
      );
    }

    let uploadedFile: UploadedFile | undefined;

    // If new file is provided
    if (file) {
      // Validate file type if provided
      if (updateDto.fileType) {
        const detectedFileType = this.fileUploadService.getFileTypeFromMimeType(
          file.mimetype,
        );
        if (detectedFileType !== updateDto.fileType) {
          throw new BadRequestException(
            `Le type de fichier déclaré (${updateDto.fileType}) ne correspond pas au fichier uploadé (${detectedFileType})`,
          );
        }
      }

      // Validate it's a document file
      if (!this.fileUploadService.isDocumentFile(file.mimetype)) {
        throw new BadRequestException(
          "Seuls les documents (PDF, DOC, DOCX, ODT) sont autorisés pour les sujets d'évaluation",
        );
      }

      // Delete old file
      const oldFilePath = subject.fileUrl.replace(
        process.env.BASE_URL || 'http://localhost:3000',
        process.cwd(),
      );
      await this.fileUploadService.deleteFile(oldFilePath);

      // Upload new file
      uploadedFile = await this.fileUploadService.uploadFile(
        file,
        'assessment-subjects',
      );

      subject.fileUrl = uploadedFile.url;
      subject.fileType =
        updateDto.fileType ||
        (this.fileUploadService.getFileTypeFromMimeType(
          file.mimetype,
        ) as FileType);
    } else if (updateDto.fileType) {
      subject.fileType = updateDto.fileType;
    }

    const updatedSubject = await this.assessmentSubjectRepository.save(subject);

    // Load relations for response
    const subjectWithRelations = await this.assessmentSubjectRepository.findOne(
      {
        where: { id: updatedSubject.id },
        relations: ['assessment', 'uploadedByUser'],
      },
    );

    if (!subjectWithRelations) {
      throw new NotFoundException(
        'Sujet mis à jour mais non trouvé lors du rechargement',
      );
    }

    return this.mapToAssessmentSubjectResponseDto(
      subjectWithRelations,
      uploadedFile,
    );
  }

  async remove(id: string, userId?: string): Promise<void> {
    const subject = await this.assessmentSubjectRepository.findOne({
      where: { id },
    });

    if (!subject) {
      throw new NotFoundException(`Sujet avec l'ID ${id} non trouvé`);
    }

    // Check if user can delete (only the uploader can delete)
    if (userId && subject.uploadedBy !== userId) {
      throw new ForbiddenException(
        "Seul l'utilisateur qui a uploadé le fichier peut le supprimer",
      );
    }

    // Delete file from storage
    const filePath = subject.fileUrl.replace(
      process.env.BASE_URL || 'http://localhost:3000',
      process.cwd(),
    );
    await this.fileUploadService.deleteFile(filePath);

    // Delete from database
    await this.assessmentSubjectRepository.remove(subject);
  }

  private mapToAssessmentSubjectResponseDto(
    subject: AssessmentSubject,
    uploadedFile?: UploadedFile,
  ): AssessmentSubjectResponseDto {
    return {
      id: subject.id,
      assessmentId: subject.assessmentId,
      assessmentTitle: subject.assessment?.title || '',
      fileUrl: subject.fileUrl,
      fileType: subject.fileType,
      uploadedBy: subject.uploadedBy,
      uploadedByName: subject.uploadedByUser
        ? `${subject.uploadedByUser.firstName} ${subject.uploadedByUser.lastName}`
        : '',
      originalFileName: uploadedFile?.originalName || 'Fichier',
      fileSize: uploadedFile?.size || 0,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
    };
  }
}
