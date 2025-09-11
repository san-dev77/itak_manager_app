import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  MinLength,
} from 'class-validator';
import { UserResponseDto } from 'src/modules/user/dto/user.dto';
import { RelationshipType } from 'src/entities/student-parent.entity';

export class CreateParentDto {
  @IsUUID('4', { message: 'userId doit être un UUID valide' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'La profession doit être une chaîne' })
  @MinLength(2, {
    message: 'La profession doit contenir au moins 2 caractères',
  })
  job?: string;
}

export class UpdateParentDto extends PartialType(CreateParentDto) {}

export class ParentResponseDto {
  id: string;
  job?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: UserResponseDto;
}

export class CreateStudentParentDto {
  @IsUUID('4', { message: 'studentId doit être un UUID valide' })
  studentId: string;

  @IsUUID('4', { message: 'parentId doit être un UUID valide' })
  parentId: string;

  @IsEnum(RelationshipType, {
    message: 'Le type de relation doit être valide',
  })
  relationship: RelationshipType;
}

export class StudentParentResponseDto {
  id: string;
  studentId: string;
  parentId: string;
  relationship: RelationshipType;
  createdAt: Date;
  updatedAt: Date;
}
