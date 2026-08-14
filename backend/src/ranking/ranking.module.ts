import { Module } from '@nestjs/common';
import { RankingGateway } from './ranking.gateway';
import { RankingService } from './ranking.service';

@Module({
  providers: [RankingGateway, RankingService],
  exports: [RankingService],
})
export class RankingModule {}
