import { ConfigService } from '@nestjs/config';
export interface UploadedFile {
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    url: string;
}
export declare class FileUploadService {
    private readonly configService;
    private readonly storageConfig;
    private readonly uploadDir;
    constructor(configService: ConfigService);
    private ensureUploadDirectory;
    uploadFile(file: Express.Multer.File, subfolder?: string): Promise<UploadedFile>;
    deleteFile(filePath: string): Promise<void>;
    private validateFile;
    getFileTypeFromMimeType(mimeType: string): string;
    isDocumentFile(mimeType: string): boolean;
}
