declare const _default: (() => {
    url: string;
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    keyPrefix: string;
    ttl: number;
    maxRetriesPerRequest: number;
    retryDelayOnFailover: number;
    enableReadyCheck: boolean;
    lazyConnect: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    url: string;
    host: string;
    port: number;
    password: string | undefined;
    db: number;
    keyPrefix: string;
    ttl: number;
    maxRetriesPerRequest: number;
    retryDelayOnFailover: number;
    enableReadyCheck: boolean;
    lazyConnect: boolean;
}>;
export default _default;
