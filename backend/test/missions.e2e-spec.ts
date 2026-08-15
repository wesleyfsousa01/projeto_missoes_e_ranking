import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { setupApp } from '@/setup-app';
import { Server } from 'http';

describe('Missions Flow (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);

    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await prisma.cleanDb();
  });

  // Função auxiliar (Factory)
  async function setupTestScenario() {
    const mission = await prisma.mission.create({
      data: {
        title: 'Missão Teste',
        description: 'XPTO',
        points: 100,
        order: 1,
      },
    });

    const registerResponse = await request(app.getHttpServer() as Server)
      .post('/api/auth/register')
      .send({
        name: 'Tester',
        email: 'tester@test.com',
        password: 'password123',
      });

    expect(registerResponse.status).toBe(HttpStatus.CREATED);

    const body = registerResponse.body as {
      access_token: string;
      player: { id: string };
    };

    return {
      missionId: mission.id,
      token: body.access_token,
      playerId: body.player.id,
    };
  }

  describe('POST /api/missions/:id/complete', () => {
    it('deve completar uma missão com sucesso e retornar o objeto de completion completo (Happy Path)', async () => {
      const { missionId, token, playerId } = await setupTestScenario();

      const response = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.CREATED);

      const body = response.body as {
        missionId: string;
        playerId: string;
        currentScore: number;
        completedAt: string;
      };

      expect(body).toMatchObject({
        missionId: missionId,
        playerId: playerId,
        currentScore: 100,
      });

      expect(body.completedAt).toBeDefined();
    });

    it('deve acumular o score corretamente ao completar múltiplas missões diferentes', async () => {
      const { missionId, token, playerId } = await setupTestScenario(); // Missão de 100 pts

      // Cria uma segunda missão com 50 pontos
      const secondMission = await prisma.mission.create({
        data: {
          title: 'Segunda Missão',
          description: 'Mais pontos',
          points: 50,
          order: 2,
        },
      });

      // Completa a primeira (100)
      await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      // Completa a segunda (50)
      const secondResponse = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${secondMission.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      const secondBody = secondResponse.body as { currentScore: number };

      // O score final na resposta da segunda deve ser 150
      expect(secondResponse.status).toBe(HttpStatus.CREATED);
      expect(secondBody.currentScore).toBe(150);

      // Garante também olhando no banco
      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });
      expect(player?.score).toBe(150);
    });

    it('deve retornar 409 Conflict ao tentar duplicidade na mesma missão', async () => {
      const { missionId, token } = await setupTestScenario();

      // Completa a 1ª vez
      await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      // Tenta a 2ª vez
      const duplicateResponse = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(duplicateResponse.status).toBe(HttpStatus.CONFLICT);
    });

    it('deve lidar com concorrência (clique duplo) e computar a missão apenas uma vez', async () => {
      const { missionId, token, playerId } = await setupTestScenario();

      // Dispara 3 requisições simultaneamente (em paralelo)
      const req1 = request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);
      const req2 = request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);
      const req3 = request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      const [res1, res2, res3] = await Promise.all([req1, req2, req3]);

      const statusCodes = [res1.status, res2.status, res3.status];

      const sucessos = statusCodes.filter(
        (status) => status === Number(HttpStatus.CREATED),
      ).length;
      const conflitos = statusCodes.filter(
        (status) => status === Number(HttpStatus.CONFLICT),
      ).length;

      expect(sucessos).toBe(1); // Apenas UMA requisição pode ter sucesso
      expect(conflitos).toBe(2); // As outras DUAS devem ser barradas pelo banco/código

      const player = await prisma.player.findUnique({
        where: { id: playerId },
      });

      expect(player?.score).toBe(100);
    });

    it('deve retornar 401 Unauthorized se não enviar o token JWT', async () => {
      const { missionId } = await setupTestScenario();

      const response = await request(app.getHttpServer() as Server).post(
        `/api/missions/${missionId}/complete`,
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('deve retornar 401 Unauthorized se enviar um token JWT malformado/inválido', async () => {
      const { missionId } = await setupTestScenario();

      const response = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missionId}/complete`)
        .set('Authorization', 'Bearer token_super_invalido_que_nao_passara');

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('deve retornar 400 Bad Request ao enviar um missionId que não é um UUID válido', async () => {
      const { token } = await setupTestScenario();
      const invalidUuid = 'isso-nao-e-um-uuid';

      const response = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${invalidUuid}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('deve retornar 404 Not Found ao tentar completar uma missão com UUID válido mas inexistente no banco', async () => {
      const { token } = await setupTestScenario();
      const fakeMissionId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${fakeMissionId}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it('deve retornar 403 Forbidden se tentar completar uma missão sem ter concluído seus pré-requisitos', async () => {
      const { token } = await setupTestScenario();

      // Criar missão base e missão avançada
      const missaoBase = await prisma.mission.create({
        data: { title: 'Base', description: 'Base', points: 10, order: 1 },
      });
      const missaoAvancada = await prisma.mission.create({
        data: {
          title: 'Avancada',
          description: 'Avançada',
          points: 50,
          order: 2,
        },
      });

      // Adicionar pré-requisito
      await prisma.missionPrerequisite.create({
        data: { missionId: missaoAvancada.id, prerequisiteId: missaoBase.id },
      });

      // Tenta completar a avançada diretamente
      const erroResponse = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missaoAvancada.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(erroResponse.status).toBe(HttpStatus.FORBIDDEN);

      // Agora completa a base
      await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missaoBase.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      // Tenta completar a avançada novamente
      const sucessoResponse = await request(app.getHttpServer() as Server)
        .post(`/api/missions/${missaoAvancada.id}/complete`)
        .set('Authorization', `Bearer ${token}`);

      expect(sucessoResponse.status).toBe(HttpStatus.CREATED);
    });
  });
});
