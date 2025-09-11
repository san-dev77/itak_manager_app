import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import type { UserResponseDto } from './dto/user.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<UserResponseDto> {
    return this.userService.getUserByEmail(email);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }

  @Put(':id/deactivate')
  async deactivateUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.deactivateUser(id);
  }

  @Put(':id/activate')
  async activateUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.activateUser(id);
  }
}
