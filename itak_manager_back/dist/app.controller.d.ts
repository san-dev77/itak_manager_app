import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
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
