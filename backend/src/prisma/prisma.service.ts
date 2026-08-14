import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDb() {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        'Tentativa de limpar o banco fora do ambiente de testes foi bloqueada por segurança!',
      );
      return;
    }

    await this.playerMission.deleteMany();
    await this.mission.deleteMany();
    await this.player.deleteMany();
  }
}
