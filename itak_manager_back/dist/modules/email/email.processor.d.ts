import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService, WelcomeEmailData } from './email.service';
export declare class EmailProcessor extends WorkerHost {
    private emailService;
    constructor(emailService: EmailService);
    process(job: Job<WelcomeEmailData>): Promise<void>;
}
