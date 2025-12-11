import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { EmailService, WelcomeEmailData } from './email.service';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  constructor(private emailService: EmailService) {
    super();
  }

  async process(job: Job<WelcomeEmailData>): Promise<void> {
    switch (job.name) {
      case 'welcome-email':
        await this.emailService.processWelcomeEmail(job.data);
        break;
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }
}
