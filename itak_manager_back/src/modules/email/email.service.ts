import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as nodemailer from 'nodemailer';
import * as ejs from 'ejs';
import * as path from 'path';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities';
import { Utils } from 'src/utils/utils';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/user.dto';

export interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  loginUrl: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectQueue('email') private emailQueue: Queue,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('app.smtpHost'),
      port: this.configService.get('app.smtpPort'),
      secure: false,
      auth: {
        user: this.configService.get('app.smtpUser'),
        pass: this.configService.get('app.smtpPass'),
      },
    });

    // Verify SMTP connection on startup
    void this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection failed:', error.message);
      this.logger.warn('Email functionality may not work properly');
    }
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    try {
      this.logger.log(`Queuing welcome email for ${data.email}`);
      await this.emailQueue.add('welcome-email', data, {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: 10,
        removeOnFail: 5,
      });
      this.logger.log(`Welcome email queued successfully for ${data.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to queue welcome email for ${data.email}:`,
        error.message,
      );
      throw error;
    }
  }

  async processWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const startTime = Date.now();
    this.logger.log(`Processing welcome email for ${data.email}`);

    try {
      // Validate email data
      this.validateEmailData(data);

      // Try multiple template paths for robustness
      const possiblePaths = [
        path.join(process.cwd(), 'src', 'templates', 'welcome-email.ejs'),
        path.join(__dirname, '..', '..', 'templates', 'welcome-email.ejs'),
        path.join(process.cwd(), 'dist', 'templates', 'welcome-email.ejs'),
      ];

      let templatePath: string | null = null;
      for (const possiblePath of possiblePaths) {
        if (fs.existsSync(possiblePath)) {
          templatePath = possiblePath;
          this.logger.debug(`Found template at: ${possiblePath}`);
          break;
        }
      }

      if (!templatePath) {
        const errorMsg = `Welcome email template not found. Searched paths: ${possiblePaths.join(', ')}`;
        this.logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      // Render email template
      const templateData = {
        ...data,
        logoUrl: `${this.configService.get('app.frontendUrl')}/app-logo.png`,
        appName: this.configService.get('app.name'),
        supportEmail: this.configService.get('app.supportEmail'),
        currentYear: new Date().getFullYear(),
      };

      const html = await ejs.renderFile(templatePath, templateData);
      this.logger.debug(`Template rendered successfully for ${data.email}`);

      const mailOptions = {
        from: {
          name: this.configService.get('app.name'),
          address: this.configService.get(
            'app.smtpFrom',
            this.configService.get('app.smtpUser'),
          ),
        },
        to: data.email,
        subject: `${this.configService.get('app.name')} - Vos informations de connexion`,
        html,
      };

      // Send email with retry logic
      const result = await this.sendMailWithRetry(mailOptions, 3);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Welcome email sent successfully to ${data.email} in ${duration}ms`,
      );

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Failed to send welcome email to ${data.email} after ${duration}ms:`,
        {
          error: error.message,
          stack: error.stack,
          emailData: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
        },
      );
      throw error;
    }
  }

  private validateEmailData(data: WelcomeEmailData): void {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'password',
      'role',
      'loginUrl',
    ];
    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required email data fields: ${missingFields.join(', ')}`,
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error(`Invalid email format: ${data.email}`);
    }
  }

  private async sendMailWithRetry(
    mailOptions: any,
    maxRetries: number,
  ): Promise<void> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.transporter.sendMail(mailOptions);
        if (attempt > 1) {
          this.logger.log(`Email sent successfully on attempt ${attempt}`);
        }
        return;
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Email send attempt ${attempt}/${maxRetries} failed:`,
          error.message,
        );

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          this.logger.debug(`Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(
      `Failed to send email after ${maxRetries} attempts. Last error: ${lastError?.message}`,
    );
  }

  async resendWelcomeEmail(
    userId: string,
    userService: UserService,
  ): Promise<void> {
    this.logger.log(`Resending welcome email for user ID: ${userId}`);

    try {
      // Get user details with relations
      const user: UserResponseDto = await userService.getUserById(userId);
      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      if (!user.isActive) {
        throw new Error(
          `Cannot send welcome email to inactive user: ${user.email}`,
        );
      }

      // Generate new temporary password
      const newPassword = Utils.generateRandomString(10);

      // Update user password
      await userService.updatePassword(userId, newPassword);

      // Prepare email data
      const emailData: WelcomeEmailData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: newPassword,
        role: user.role,
        loginUrl: this.configService.get('app.loginUrl')!,
      };

      // Send welcome email
      await this.sendWelcomeEmail(emailData);

      this.logger.log(
        `Welcome email with new password sent successfully to ${user.email}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to resend welcome email for user ${userId}:`,
        error.message,
      );
      throw error;
    }
  }
}
