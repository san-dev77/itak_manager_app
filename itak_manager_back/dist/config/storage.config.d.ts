export interface StorageConfig {
    maxFileSize: number;
    allowedMimeTypes: string[];
    imageQuality: number;
    thumbnailSizes: Array<{
        width: number;
        height: number;
        suffix: string;
    }>;
    signedUrlExpiration: number;
    quotas: {
        dailyUploadLimit: number;
        totalStorageLimit: number;
    };
}
declare const _default: (() => StorageConfig) & import("@nestjs/config").ConfigFactoryKeyHost<StorageConfig>;
export default _default;
