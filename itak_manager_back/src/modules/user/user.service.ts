import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import { Utils } from '../../utils/utils';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(EmailService)
    @Optional()
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Vérifier si l'utilisateur existe déjà (seulement si email fourni)
      if (createUserDto.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: createUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException(
            'Un utilisateur avec cet email existe déjà',
          );
        }
      }

      const password = createUserDto.password || Utils.generateRandomString(10);

      // Hacher le mot de passe
      const hashedPassword = await Utils.hashPassword(password);

      // Générer un nom d'utilisateur unique si non fourni
      const username =
        createUserDto.username ||
        (await this.generateUsername(
          createUserDto.firstName,
          createUserDto.lastName,
        ));

      // Créer l'utilisateur
      const user = this.userRepository.create({
        username,
        email: createUserDto.email || undefined,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        gender: createUserDto.gender,
        birthDate: createUserDto.birthDate
          ? new Date(createUserDto.birthDate)
          : undefined,
        phone: createUserDto.phone,
        password: hashedPassword,
        role: createUserDto.role || UserRole.SCOLARITE,
        isActive: true,
      });

      // Send welcome email if EmailService is available AND email provided
      if (this.emailService && createUserDto.email) {
        try {
          await this.emailService.sendWelcomeEmail({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            password,
            role: createUserDto.role || UserRole.SCOLARITE,
            loginUrl: `${this.configService.get('app.frontendUrl')}/login`,
          });
        } catch (emailError) {
          // Log email error but don't fail user creation
          console.warn('Failed to send welcome email:', emailError);
        }
      }

      const savedUser = await this.userRepository.save(user);
      return this.mapToUserResponseDto(savedUser);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la création de l'utilisateur: ${message}`,
      );
    }
  }

  async generateUsername(firstName: string, lastName: string): Promise<string> {
    const maxLength = 50;

    // 1. Nettoyage avancé (gère les noms composés et espaces)
    const normalize = (str: string): string => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Accents
        .toLowerCase()
        .replace(/\s+/g, '') // Supprime TOUS les espaces
        .replace(/[^a-z0-9]/g, ''); // Garde seulement alphanumérique
    };

    // 2. Normalisation des parties
    const normalizedFirstName = normalize(firstName);
    const normalizedLastName = normalize(lastName);

    // 3. Création de la base avec fallback intelligent
    let baseUsername: string;

    // Cas 1: format prénom.nom (prioritaire)
    if (normalizedFirstName && normalizedLastName) {
      baseUsername = `${normalizedFirstName}.${normalizedLastName}`.slice(
        0,
        maxLength,
      );

      // Cas 2: si trop court (ex: "a.b"), on essaie prénomnom
      if (baseUsername.length < 3) {
        baseUsername = `${normalizedFirstName}${normalizedLastName}`.slice(
          0,
          maxLength,
        );
      }
    }
    // Cas 3: si prénom ou nom manquant
    else if (normalizedFirstName) {
      baseUsername = normalizedFirstName.slice(0, maxLength);
    } else if (normalizedLastName) {
      baseUsername = normalizedLastName.slice(0, maxLength);
    } else {
      throw new Error('Prénom et nom vides après normalisation');
    }

    // 4. Vérification des doublons avec sécurité
    let usernameFinal = baseUsername;
    let suffixe = 1;
    const maxAttempts = 10000;

    while (await this.usernameExists(usernameFinal)) {
      const suffixeStr = suffixe.toString();
      const availableLength = maxLength - suffixeStr.length - 1; // -1 pour le séparateur éventuel

      // Tronquage intelligent
      if (usernameFinal.includes('.')) {
        const [firstPart, lastPart] = usernameFinal.split('.');
        usernameFinal = `${firstPart.slice(0, availableLength / 2)}.${lastPart.slice(0, availableLength / 2)}${suffixe}`;
      } else {
        usernameFinal = `${usernameFinal.slice(0, availableLength)}${suffixe}`;
      }

      suffixe++;
      if (suffixe > maxAttempts) {
        throw new Error(
          `Impossible de générer un username unique après ${maxAttempts} tentatives`,
        );
      }
    }

    return usernameFinal;
  }

  private async usernameExists(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return !!user;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const hashedPassword = await Utils.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepository.find({
        order: { createdAt: 'DESC' },
      });

      return users.map((user) => this.mapToUserResponseDto(user));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération des utilisateurs: ${message}`,
      );
    }
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${message}`,
      );
    }
  }

  async getUserByEmail(email: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        throw new NotFoundException('Utilisateur non trouvé');
      }

      return this.mapToUserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la récupération de l'utilisateur: ${message}`,
      );
    }
  }

  async getUserByEmailWithPassword(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { email },
      });

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    try {
      // Vérifier que l'utilisateur existe
      const existingUser = await this.getUserById(id);

      // Mettre à jour l'utilisateur
      await this.userRepository.update(id, {
        ...updateUserDto,
        updatedAt: new Date(),
      });

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await this.userRepository.findOne({
        where: { id },
      });

      if (!updatedUser) {
        throw new NotFoundException('Utilisateur non trouvé après mise à jour');
      }
      return this.mapToUserResponseDto(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la mise à jour de l'utilisateur: ${message}`,
      );
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      // Vérifier que l'utilisateur existe
      await this.getUserById(id);

      await this.userRepository.delete(id);

      return { message: 'Utilisateur supprimé avec succès' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const message =
        error instanceof Error ? error.message : 'Erreur inconnue';
      throw new Error(
        `Erreur lors de la suppression de l'utilisateur: ${message}`,
      );
    }
  }

  async deactivateUser(id: string): Promise<UserResponseDto> {
    return this.updateUser(id, { isActive: false });
  }

  async activateUser(id: string): Promise<UserResponseDto> {
    return this.updateUser(id, { isActive: true });
  }

  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      birthDate: user.birthDate,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
