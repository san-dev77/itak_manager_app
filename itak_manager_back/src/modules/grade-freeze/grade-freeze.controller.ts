import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GradeFreezeService } from './grade-freeze.service';
import { CreateFreezePeriodDto } from './dto/create-freeze-period.dto';
import { UpdateFreezePeriodDto } from './dto/update-freeze-period.dto';
import {
  FreezePeriodResponseDto,
  FreezeStatusCheckDto,
  ApproveFreezePeriodDto,
  CancelFreezePeriodDto,
  VerifyOverrideDto,
} from './dto/freeze-period-response.dto';
import {
  FreezeScope,
  FreezeStatus,
} from '../../entities/grade-freeze-period.entity';

@Controller('grade-freeze')
export class GradeFreezeController {
  constructor(private readonly gradeFreezeService: GradeFreezeService) {}

  @Post()
  async createFreezePeriod(
    @Body() createFreezePeriodDto: CreateFreezePeriodDto,
  ): Promise<FreezePeriodResponseDto> {
    return await this.gradeFreezeService.createFreezePeriod(
      createFreezePeriodDto.schoolYearId,
      createFreezePeriodDto.title,
      createFreezePeriodDto.description || undefined,
      createFreezePeriodDto.scope,
      new Date(createFreezePeriodDto.startDate),
      new Date(createFreezePeriodDto.endDate),
      createFreezePeriodDto.createdBy,
      createFreezePeriodDto.termId,
      createFreezePeriodDto.classId,
      createFreezePeriodDto.allowEmergencyOverride,
      createFreezePeriodDto.overridePassword,
    );
  }

  @Get()
  async getFreezePeriods(
    @Query('schoolYearId') schoolYearId?: string,
    @Query('status') status?: FreezeStatus,
    @Query('scope') scope?: FreezeScope,
    @Query('termId') termId?: string,
    @Query('classId') classId?: string,
  ): Promise<FreezePeriodResponseDto[]> {
    return await this.gradeFreezeService.getFreezePeriods(
      schoolYearId,
      status,
      scope,
      termId,
      classId,
    );
  }

  @Get(':id')
  async getFreezePeriodById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FreezePeriodResponseDto> {
    return await this.gradeFreezeService.getFreezePeriodById(id);
  }

  @Get('check/status')
  async checkFreezeStatus(
    @Query('schoolYearId', ParseUUIDPipe) schoolYearId: string,
    @Query('termId') termId?: string,
    @Query('classId') classId?: string,
  ): Promise<FreezeStatusCheckDto> {
    return await this.gradeFreezeService.isGradeFrozen(
      schoolYearId,
      termId,
      classId,
    );
  }

  @Post(':id/approve')
  async approveFreezePeriod(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() approveDto: ApproveFreezePeriodDto,
  ): Promise<FreezePeriodResponseDto> {
    return await this.gradeFreezeService.approveFreezePeriod(
      id,
      approveDto.approvedBy,
    );
  }

  @Post(':id/cancel')
  async cancelFreezePeriod(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() cancelDto: CancelFreezePeriodDto,
  ): Promise<FreezePeriodResponseDto> {
    return await this.gradeFreezeService.cancelFreezePeriod(
      id,
      cancelDto.cancelledBy,
      cancelDto.reason,
    );
  }

  @Post(':id/verify-override')
  async verifyOverridePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() verifyDto: VerifyOverrideDto,
  ): Promise<{ isValid: boolean }> {
    const isValid = await this.gradeFreezeService.verifyOverridePassword(
      id,
      verifyDto.password,
    );
    return { isValid };
  }

  @Put(':id')
  async updateFreezePeriod(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFreezePeriodDto: UpdateFreezePeriodDto,
  ): Promise<FreezePeriodResponseDto> {
    const updates: any = {};

    if (updateFreezePeriodDto.title)
      updates.title = updateFreezePeriodDto.title;
    if (updateFreezePeriodDto.description)
      updates.description = updateFreezePeriodDto.description;
    if (updateFreezePeriodDto.scope)
      updates.scope = updateFreezePeriodDto.scope;
    if (updateFreezePeriodDto.startDate)
      updates.startDate = new Date(updateFreezePeriodDto.startDate);
    if (updateFreezePeriodDto.endDate)
      updates.endDate = new Date(updateFreezePeriodDto.endDate);
    if (updateFreezePeriodDto.termId)
      updates.termId = updateFreezePeriodDto.termId;
    if (updateFreezePeriodDto.classId)
      updates.classId = updateFreezePeriodDto.classId;
    if (updateFreezePeriodDto.allowEmergencyOverride !== undefined) {
      updates.allowEmergencyOverride =
        updateFreezePeriodDto.allowEmergencyOverride;
    }
    if (updateFreezePeriodDto.overridePassword) {
      updates.overridePassword = updateFreezePeriodDto.overridePassword;
    }

    return await this.gradeFreezeService.updateFreezePeriod(id, updates);
  }

  @Delete(':id')
  async deleteFreezePeriod(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.gradeFreezeService.deleteFreezePeriod(id);
    return { message: 'Freeze period deleted successfully' };
  }

  @Post('activate-scheduled')
  async activateScheduledPeriods(): Promise<{
    activated: number;
    periods: FreezePeriodResponseDto[];
  }> {
    const periods = await this.gradeFreezeService.activateScheduledPeriods();
    return {
      activated: periods.length,
      periods,
    };
  }

  @Post('complete-expired')
  async completeExpiredPeriods(): Promise<{
    completed: number;
    periods: FreezePeriodResponseDto[];
  }> {
    const periods = await this.gradeFreezeService.completeExpiredPeriods();
    return {
      completed: periods.length,
      periods,
    };
  }
}
