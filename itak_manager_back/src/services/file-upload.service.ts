import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from '../config/storage.config';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

@Injectable()
export class FileUploadService {
  private readonly storageConfig: StorageConfig;
  private readonly uploadDir: string;

  constructor(private readonly configService: ConfigService) {
    this.storageConfig = this.configService.get<StorageConfig>('storage')!;
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    subfolder?: string,
  ): Promise<UploadedFile> {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${fileExtension}`;

    // Determine upload path
    const uploadPath = subfolder
      ? path.join(this.uploadDir, subfolder)
      : this.uploadDir;

    // Ensure subfolder exists
    try {
      await fs.access(uploadPath);
    } catch {
      await fs.mkdir(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, filename);

    // Save file
    await fs.writeFile(filePath, file.buffer);

    // Generate URL
    const relativePath = subfolder
      ? `uploads/${subfolder}/${filename}`
      : `uploads/${filename}`;

    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    const fileUrl = `${baseUrl}/${relativePath}`;

    return {
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      url: fileUrl,
    };
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore error
      console.warn(`Could not delete file: ${filePath}`, error);
    }
  }

  private validateFile(file: Express.Multer.File): void {
    // Check file size
    if (file.size > this.storageConfig.maxFileSize) {
      throw new BadRequestException(
        `La taille du fichier dépasse la taille maximale autorisée de ${this.storageConfig.maxFileSize} octets`,
      );
    }

    // Check MIME type
    if (!this.storageConfig.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Le type de fichier ${file.mimetype} n'est pas autorisé. Types autorisés: ${this.storageConfig.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  getFileTypeFromMimeType(mimeType: string): string {
    const mimeToExtension: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'docx',
      'application/vnd.oasis.opendocument.text': 'odt',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'xlsx',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'pptx',
      'application/zip': 'zip',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };

    return mimeToExtension[mimeType] || 'unknown';
  }

  isDocumentFile(mimeType: string): boolean {
    const documentMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.oasis.opendocument.text',
    ];

    return documentMimeTypes.includes(mimeType);
  }
}
