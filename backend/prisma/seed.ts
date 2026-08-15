import { PrismaClient, Mission } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seeding de missões (Ordem Sequencial)...');

  const missions = [
    {
      title: 'Missão 1: Primeiros Passos',
      description: 'Crie sua conta na plataforma.',
      points: 10,
      order: 1,
    },
    {
      title: 'Missão 2: Explorador',
      description: 'Visite a página de ranking pela primeira vez.',
      points: 20,
      order: 2,
    },
    {
      title: 'Missão 3: Iniciante',
      description: 'Complete sua primeira missão.',
      points: 50,
      order: 3,
    },
    {
      title: 'Missão 4: Social',
      description: 'Convide um amigo para a plataforma.',
      points: 30,
      order: 4,
    },
    {
      title: 'Missão 5: Veterano',
      description: 'Complete 5 missões diferentes.',
      points: 100,
      order: 5,
    },
    {
      title: 'Missão 6: Consistente',
      description: 'Faça login por 7 dias seguidos.',
      points: 80,
      order: 6,
    },
    {
      title: 'Missão 7: Caçador de Bugs',
      description: 'Reporte um bug válido no sistema.',
      points: 150,
      order: 7,
    },
    {
      title: 'Missão 8: Especialista',
      description: 'Alcance 1000 pontos no ranking.',
      points: 200,
      order: 8,
    },
    {
      title: 'Missão 9: Mestre das Missões',
      description: 'Complete todas as missões diárias.',
      points: 120,
      order: 9,
    },
    {
      title: 'Missão 10: Lenda Viva',
      description: 'Seja o número 1 do ranking por 24 horas.',
      points: 500,
      order: 10,
    },
  ];

  const missionRecords: Record<string, Mission> = {};
  const missionTitles = missions.map((m) => m.title);

  // Passo 1: Upsert das missões
  for (const mission of missions) {
    let existing = await prisma.mission.findFirst({
      where: { title: mission.title },
    });

    if (!existing) {
      existing = await prisma.mission.create({ data: mission });
      console.log(`[Seed] Missão criada: ${mission.title}`);
    } else {
      existing = await prisma.mission.update({
        where: { id: existing.id },
        data: mission,
      });
      console.log(`[Seed] Missão atualizada: ${mission.title}`);
    }
    missionRecords[existing.title] = existing;
  }

  // Passo 2: Upsert dos pré-requisitos sequenciais (Missão N depende de TODAS as anteriores)
  for (let i = 1; i < missionTitles.length; i++) {
    const currentMissionTitle = missionTitles[i];
    const currentMission = missionRecords[currentMissionTitle];

    for (let j = 0; j < i; j++) {
      const depTitle = missionTitles[j];
      const depMission = missionRecords[depTitle];

      if (currentMission && depMission) {
        await prisma.missionPrerequisite.upsert({
          where: {
            missionId_prerequisiteId: {
              missionId: currentMission.id,
              prerequisiteId: depMission.id,
            },
          },
          update: {},
          create: {
            missionId: currentMission.id,
            prerequisiteId: depMission.id,
          },
        });
      }
    }
    console.log(
      `[Seed] Pré-requisitos configurados para: ${currentMissionTitle}`,
    );
  }

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
