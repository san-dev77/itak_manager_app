export declare class AppService {
    getStatus(): {
        status: string;
        service: string;
        version: string;
        timestamp: any;
        environment: any;
    };
    getHealth(): {
        status: string;
        uptime: any;
        memory: any;
        timestamp: any;
    };
}
