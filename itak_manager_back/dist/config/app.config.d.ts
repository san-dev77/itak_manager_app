export declare const appConfig: {
    name: string;
    version: string;
    port: string | number;
    environment: string;
    cors: {
        origin: string;
        credentials: boolean;
    };
    rateLimit: {
        windowMs: number;
        max: number;
    };
};
