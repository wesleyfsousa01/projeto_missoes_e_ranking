import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { RankingResponseDto } from './dto/ranking-response.dto';

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getTopRanking(limit: number = 10): Promise<RankingResponseDto[]> {
    return this.prisma.player.findMany({
      select: {
        id: true,
        name: true,
        score: true,
      },
      orderBy: {
        score: 'desc',
      },
      take: limit,
    });
  }
}
