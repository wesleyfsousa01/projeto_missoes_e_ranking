import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CurrentPlayer } from '@/auth/decorators/current-player.decorator';
import { MissionsExceptionsFilter } from './filters/missions-exceptions.filters';
import { MissionResponseDto } from './dto/mission-response.dto';
import { CompleteMissionResponseDto } from './dto/complete-mission-response.dto';
import { CompletedMissionResponseDto } from './dto/completed-mission-response-dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { AuthExceptionsFilter } from '@/auth/filters/auth-exceptions.filter';

@UseFilters(MissionsExceptionsFilter, AuthExceptionsFilter)
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Get()
  async findAll(): Promise<MissionResponseDto[]> {
    return this.missionsService.findAllMissions();
  }

  @UseGuards(AuthGuard)
  @Get('completed')
  async getCompletedMissions(
    @CurrentPlayer() playerId: string,
  ): Promise<CompletedMissionResponseDto[]> {
    return this.missionsService.getCompletedMissions(playerId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/complete')
  async completeMission(
    @Param('id', ParseUUIDPipe) missionId: string,
    @CurrentPlayer() playerId: string,
  ): Promise<CompleteMissionResponseDto> {
    return this.missionsService.completeMission(missionId, playerId);
  }
}
