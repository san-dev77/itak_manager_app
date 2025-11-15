"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const nodemailer = __importStar(require("nodemailer"));
const ejs = __importStar(require("ejs"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const config_1 = require("@nestjs/config");
const utils_1 = require("../../utils/utils");
let EmailService = EmailService_1 = class EmailService {
    emailQueue;
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter;
    constructor(emailQueue, configService) {
        this.emailQueue = emailQueue;
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('app.smtpHost'),
            port: this.configService.get('app.smtpPort'),
            secure: false,
            auth: {
                user: this.configService.get('app.smtpUser'),
                pass: this.configService.get('app.smtpPass'),
            },
        });
        void this.verifyConnection();
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            this.logger.log('SMTP connection verified successfully');
        }
        catch (error) {
            this.logger.error('SMTP connection failed:', error.message);
            this.logger.warn('Email functionality may not work properly');
        }
    }
    async sendWelcomeEmail(data) {
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
        }
        catch (error) {
            this.logger.error(`Failed to queue welcome email for ${data.email}:`, error.message);
            throw error;
        }
    }
    async processWelcomeEmail(data) {
        const startTime = Date.now();
        this.logger.log(`Processing welcome email for ${data.email}`);
        try {
            this.validateEmailData(data);
            const possiblePaths = [
                path.join(process.cwd(), 'src', 'templates', 'welcome-email.ejs'),
                path.join(__dirname, '..', '..', 'templates', 'welcome-email.ejs'),
                path.join(process.cwd(), 'dist', 'templates', 'welcome-email.ejs'),
            ];
            let templatePath = null;
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
                    address: this.configService.get('app.smtpFrom', this.configService.get('app.smtpUser')),
                },
                to: data.email,
                subject: `${this.configService.get('app.name')} - Vos informations de connexion`,
                html,
            };
            const result = await this.sendMailWithRetry(mailOptions, 3);
            const duration = Date.now() - startTime;
            this.logger.log(`Welcome email sent successfully to ${data.email} in ${duration}ms`);
            return result;
        }
        catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Failed to send welcome email to ${data.email} after ${duration}ms:`, {
                error: error.message,
                stack: error.stack,
                emailData: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                },
            });
            throw error;
        }
    }
    validateEmailData(data) {
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
            throw new Error(`Missing required email data fields: ${missingFields.join(', ')}`);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new Error(`Invalid email format: ${data.email}`);
        }
    }
    async sendMailWithRetry(mailOptions, maxRetries) {
        let lastError;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                await this.transporter.sendMail(mailOptions);
                if (attempt > 1) {
                    this.logger.log(`Email sent successfully on attempt ${attempt}`);
                }
                return;
            }
            catch (error) {
                lastError = error;
                this.logger.warn(`Email send attempt ${attempt}/${maxRetries} failed:`, error.message);
                if (attempt < maxRetries) {
                    const delay = Math.pow(2, attempt) * 1000;
                    this.logger.debug(`Retrying in ${delay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
            }
        }
        throw new Error(`Failed to send email after ${maxRetries} attempts. Last error: ${lastError?.message}`);
    }
    async resendWelcomeEmail(userId, userService) {
        this.logger.log(`Resending welcome email for user ID: ${userId}`);
        try {
            const user = await userService.getUserById(userId);
            if (!user) {
                throw new Error(`User with ID ${userId} not found`);
            }
            if (!user.isActive) {
                throw new Error(`Cannot send welcome email to inactive user: ${user.email}`);
            }
            const newPassword = utils_1.Utils.generateRandomString(10);
            await userService.updatePassword(userId, newPassword);
            const emailData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: newPassword,
                role: user.role,
                loginUrl: this.configService.get('app.loginUrl'),
            };
            await this.sendWelcomeEmail(emailData);
            this.logger.log(`Welcome email with new password sent successfully to ${user.email}`);
        }
        catch (error) {
            this.logger.error(`Failed to resend welcome email for user ${userId}:`, error.message);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, bullmq_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [bullmq_2.Queue,
        config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map