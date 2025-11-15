import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
export interface WelcomeEmailData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    loginUrl: string;
}
export declare class EmailService {
    private emailQueue;
    private configService;
    private readonly logger;
    private transporter;
    constructor(emailQueue: Queue, configService: ConfigService);
    private verifyConnection;
    sendWelcomeEmail(data: WelcomeEmailData): Promise<void>;
    processWelcomeEmail(data: WelcomeEmailData): Promise<void>;
    private validateEmailData;
    private sendMailWithRetry;
    resendWelcomeEmail(userId: string, userService: UserService): Promise<void>;
}
