import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getStatus(): {
        status: string;
        service: string;
        version: string;
        timestamp: string;
        environment: string;
    };
    getHealth(): {
        status: string;
        uptime: number;
        memory: NodeJS.MemoryUsage;
        timestamp: string;
    };
}
