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
import { UserService } from '../services/user.service';
import type { UserResponse } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(): Promise<UserResponse[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.getUserById(parseInt(id, 10));
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<UserResponse> {
    return this.userService.getUserByEmail(email);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.userService.updateUser(parseInt(id, 10), updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(parseInt(id, 10));
  }

  @Put(':id/deactivate')
  async deactivateUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.deactivateUser(parseInt(id, 10));
  }

  @Put(':id/activate')
  async activateUser(@Param('id') id: string): Promise<UserResponse> {
    return this.userService.activateUser(parseInt(id, 10));
  }
}
