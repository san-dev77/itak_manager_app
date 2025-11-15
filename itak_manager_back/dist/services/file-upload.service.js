"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
let FileUploadService = class FileUploadService {
    configService;
    storageConfig;
    uploadDir;
    constructor(configService) {
        this.configService = configService;
        this.storageConfig = this.configService.get('storage');
        this.uploadDir = path.join(process.cwd(), 'uploads');
        this.ensureUploadDirectory();
    }
    async ensureUploadDirectory() {
        try {
            await fs.access(this.uploadDir);
        }
        catch {
            await fs.mkdir(this.uploadDir, { recursive: true });
        }
    }
    async uploadFile(file, subfolder) {
        this.validateFile(file);
        const fileExtension = path.extname(file.originalname);
        const filename = `${crypto.randomUUID()}${fileExtension}`;
        const uploadPath = subfolder
            ? path.join(this.uploadDir, subfolder)
            : this.uploadDir;
        try {
            await fs.access(uploadPath);
        }
        catch {
            await fs.mkdir(uploadPath, { recursive: true });
        }
        const filePath = path.join(uploadPath, filename);
        await fs.writeFile(filePath, file.buffer);
        const relativePath = subfolder
            ? `uploads/${subfolder}/${filename}`
            : `uploads/${filename}`;
        const baseUrl = this.configService.get('BASE_URL') || 'http://localhost:3000';
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
    async deleteFile(filePath) {
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
            console.warn(`Could not delete file: ${filePath}`, error);
        }
    }
    validateFile(file) {
        if (file.size > this.storageConfig.maxFileSize) {
            throw new common_1.BadRequestException(`La taille du fichier dépasse la taille maximale autorisée de ${this.storageConfig.maxFileSize} octets`);
        }
        if (!this.storageConfig.allowedMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException(`Le type de fichier ${file.mimetype} n'est pas autorisé. Types autorisés: ${this.storageConfig.allowedMimeTypes.join(', ')}`);
        }
    }
    getFileTypeFromMimeType(mimeType) {
        const mimeToExtension = {
            'application/pdf': 'pdf',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.oasis.opendocument.text': 'odt',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
            'application/zip': 'zip',
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/webp': 'webp',
        };
        return mimeToExtension[mimeType] || 'unknown';
    }
    isDocumentFile(mimeType) {
        const documentMimeTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.oasis.opendocument.text',
        ];
        return documentMimeTypes.includes(mimeType);
    }
};
exports.FileUploadService = FileUploadService;
exports.FileUploadService = FileUploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FileUploadService);
//# sourceMappingURL=file-upload.service.js.map