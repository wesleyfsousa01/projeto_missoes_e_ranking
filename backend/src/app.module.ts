import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MissionsModule } from './missions/missions.module';

@Module({
  imports: [PrismaModule, AuthModule, MissionsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
