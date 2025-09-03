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
import { StaffService } from '../services/staff.service';
import { CreateStaffDto, UpdateStaffDto } from '../dto/staff.dto';
import type { StaffResponse } from '../models/staff.model';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStaff(
    @Body(ValidationPipe) createStaffDto: CreateStaffDto,
  ): Promise<StaffResponse> {
    return this.staffService.createStaff(createStaffDto);
  }

  @Get()
  async getAllStaff(): Promise<StaffResponse[]> {
    return this.staffService.getAllStaff();
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string): Promise<StaffResponse> {
    return this.staffService.getStaffById(parseInt(id, 10));
  }

  @Get('user/:userId')
  async getStaffByUserId(
    @Param('userId') userId: string,
  ): Promise<StaffResponse> {
    return this.staffService.getStaffByUserId(parseInt(userId, 10));
  }

  @Get('matricule/:matricule')
  async getStaffByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<StaffResponse> {
    return this.staffService.getStaffByMatricule(matricule);
  }

  @Get('position/:position')
  async getStaffByPosition(
    @Param('position') position: string,
  ): Promise<StaffResponse[]> {
    return this.staffService.getStaffByPosition(position);
  }

  @Put(':id')
  async updateStaff(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponse> {
    return this.staffService.updateStaff(parseInt(id, 10), updateStaffDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStaff(@Param('id') id: string): Promise<{ message: string }> {
    return this.staffService.deleteStaff(parseInt(id, 10));
  }
}
