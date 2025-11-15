"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('storage', () => ({
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    allowedMimeTypes: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/zip',
    ],
    imageQuality: parseInt(process.env.IMAGE_QUALITY || '85'),
    thumbnailSizes: [
        { width: 150, height: 150, suffix: 'thumb' },
        { width: 400, height: 400, suffix: 'medium' },
        { width: 800, height: 600, suffix: 'large' },
    ],
    signedUrlExpiration: parseInt(process.env.SIGNED_URL_EXPIRATION || '3600'),
    quotas: {
        dailyUploadLimit: parseInt(process.env.DAILY_UPLOAD_LIMIT || '100'),
        totalStorageLimit: parseInt(process.env.TOTAL_STORAGE_LIMIT || '1073741824'),
    },
}));
//# sourceMappingURL=storage.config.js.map