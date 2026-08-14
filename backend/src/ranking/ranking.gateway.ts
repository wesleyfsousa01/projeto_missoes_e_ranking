import {
  OnGatewayConnection,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RankingService } from './ranking.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/ranking',
})
export class RankingGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(RankingGateway.name);

  constructor(private readonly rankingService: RankingService) {}

  afterInit() {
    this.logger.log('RankingGateway inicializado com sucesso.');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado no Ranking: ${client.id}`);
    try {
      const ranking = await this.rankingService.getTopRanking();
      client.emit('ranking_update', ranking);
    } catch (error) {
      this.logger.error('Erro ao buscar ranking inicial', error);
    }
  }

  @OnEvent('mission.completed')
  async handleMissionCompleted() {
    try {
      const ranking = await this.rankingService.getTopRanking();
      this.server.emit('ranking_update', ranking);
    } catch (error) {
      this.logger.error('Erro ao emitir atualização do ranking', error);
    }
  }
}
