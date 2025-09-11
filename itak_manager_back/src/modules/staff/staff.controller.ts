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
import { StaffService } from './staff.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  StaffResponseDto,
} from './dto/staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStaff(
    @Body(ValidationPipe) createStaffDto: CreateStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffService.createStaff(createStaffDto);
  }

  @Get()
  async getAllStaff(): Promise<StaffResponseDto[]> {
    return this.staffService.getAllStaff();
  }

  @Get(':id')
  async getStaffById(@Param('id') id: string): Promise<StaffResponseDto> {
    return this.staffService.getStaffById(id);
  }

  @Get('user/:userId')
  async getStaffByUserId(
    @Param('userId') userId: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.getStaffByUserId(userId);
  }

  @Get('matricule/:matricule')
  async getStaffByMatricule(
    @Param('matricule') matricule: string,
  ): Promise<StaffResponseDto> {
    return this.staffService.getStaffByMatricule(matricule);
  }

  @Get('position/:position')
  async getStaffByPosition(
    @Param('position') position: string,
  ): Promise<StaffResponseDto[]> {
    return this.staffService.getStaffByPosition(position);
  }

  @Put(':id')
  async updateStaff(
    @Param('id') id: string,
    @Body(ValidationPipe) updateStaffDto: UpdateStaffDto,
  ): Promise<StaffResponseDto> {
    return this.staffService.updateStaff(id, updateStaffDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStaff(@Param('id') id: string): Promise<{ message: string }> {
    return this.staffService.deleteStaff(id);
  }
}
