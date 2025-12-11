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
  ParseIntPipe,
} from '@nestjs/common';
import { AssessmentVersionService } from './assessment-version.service';
import { CreateVersionDto } from './dto/create-version.dto';
import { RestoreVersionDto } from './dto/restore-version.dto';
import {
  VersionResponseDto,
  VersionComparisonDto,
  VersionStatsDto,
} from './dto/version-response.dto';

@Controller('assessment-versions')
export class AssessmentVersionController {
  constructor(
    private readonly assessmentVersionService: AssessmentVersionService,
  ) {}

  @Post()
  async createVersion(
    @Body() createVersionDto: CreateVersionDto,
  ): Promise<VersionResponseDto> {
    const version = await this.assessmentVersionService.createVersion(
      createVersionDto.assessmentId,
      createVersionDto.action,
      createVersionDto.changedBy,
      createVersionDto.changeReason,
      createVersionDto.changedFields,
    );
    return version;
  }

  @Get('assessment/:assessmentId')
  async getAssessmentVersions(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<VersionResponseDto[]> {
    return await this.assessmentVersionService.getAssessmentVersions(
      assessmentId,
    );
  }

  @Get('assessment/:assessmentId/version/:versionNumber')
  async getVersion(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Param('versionNumber', ParseIntPipe) versionNumber: number,
  ): Promise<VersionResponseDto> {
    return await this.assessmentVersionService.getVersion(
      assessmentId,
      versionNumber,
    );
  }

  @Get('assessment/:assessmentId/latest')
  async getLatestVersion(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<VersionResponseDto> {
    return await this.assessmentVersionService.getLatestVersion(assessmentId);
  }

  @Get('assessment/:assessmentId/compare')
  async compareVersions(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Query('from', ParseIntPipe) fromVersion: number,
    @Query('to', ParseIntPipe) toVersion: number,
  ): Promise<VersionComparisonDto> {
    return await this.assessmentVersionService.compareVersions(
      assessmentId,
      fromVersion,
      toVersion,
    );
  }

  @Put('assessment/:assessmentId/restore')
  async restoreToVersion(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Body() restoreVersionDto: RestoreVersionDto,
  ) {
    return await this.assessmentVersionService.restoreToVersion(
      assessmentId,
      restoreVersionDto.versionNumber,
      restoreVersionDto.restoredBy,
      restoreVersionDto.restoreReason,
    );
  }

  @Get('assessment/:assessmentId/stats')
  async getVersionStats(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
  ): Promise<VersionStatsDto> {
    return await this.assessmentVersionService.getVersionStats(assessmentId);
  }

  @Delete('assessment/:assessmentId/cleanup')
  async cleanupOldVersions(
    @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
    @Query('keep', ParseIntPipe) keepVersions: number = 10,
  ): Promise<{ deletedCount: number }> {
    const deletedCount = await this.assessmentVersionService.cleanupOldVersions(
      assessmentId,
      keepVersions,
    );
    return { deletedCount };
  }
}
