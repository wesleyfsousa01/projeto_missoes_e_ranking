import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CompleteMissionResponseDto } from './dto/complete-mission-response.dto';
import { MissionAlreadyCompletedError, MissionNotFoundError } from './errors';
import { MissionResponseDto } from './dto/mission-response.dto';
import { CompletedMissionResponseDto } from './dto/completed-mission-response-dto';
import { Prisma } from '@/generated/prisma/client';

@Injectable()
export class MissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAllMissions(): Promise<MissionResponseDto[]> {
    return this.prismaService.mission.findMany({
      orderBy: { points: 'asc' },
    });
  }

  async getCompletedMissions(
    playerId: string,
  ): Promise<CompletedMissionResponseDto[]> {
    const playerMissions = await this.prismaService.playerMission.findMany({
      where: { playerId },
      include: {
        mission: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    return playerMissions.map((pm) => ({
      missionId: pm.missionId,
      title: pm.mission.title,
      description: pm.mission.description,
      points: pm.mission.points,
      completedAt: pm.completedAt,
    }));
  }

  async completeMission(
    missionId: string,
    playerId: string,
  ): Promise<CompleteMissionResponseDto> {
    const mission = await this.prismaService.mission.findUnique({
      where: { id: missionId },
    });

    if (!mission) {
      throw new MissionNotFoundError();
    }

    try {
      const result = await this.prismaService.$transaction(async (tx) => {
        const playerMission = await tx.playerMission.create({
          data: { playerId, missionId },
        });

        const updatedPlayer = await tx.player.update({
          where: { id: playerId },
          data: { score: { increment: mission.points } },
        });

        return {
          missionId: playerMission.missionId,
          playerId: playerMission.playerId,
          currentScore: updatedPlayer.score,
          completedAt: playerMission.completedAt,
        };
      });

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new MissionAlreadyCompletedError();
        }
      }

      throw error;
    }
  }
}
