import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seeding de missões...');

  const missions = [
    {
      title: 'Primeiros Passos',
      description: 'Crie sua conta na plataforma.',
      points: 10,
    },
    {
      title: 'Explorador',
      description: 'Visite a página de ranking pela primeira vez.',
      points: 20,
    },
    {
      title: 'Iniciante',
      description: 'Complete sua primeira missão.',
      points: 50,
    },
    {
      title: 'Veterano',
      description: 'Complete 5 missões diferentes.',
      points: 100,
    },
    {
      title: 'Especialista',
      description: 'Alcance 1000 pontos no ranking.',
      points: 200,
    },
    {
      title: 'Caçador de Bugs',
      description: 'Reporte um bug válido no sistema.',
      points: 150,
    },
    {
      title: 'Social',
      description: 'Convide um amigo para a plataforma.',
      points: 30,
    },
    {
      title: 'Consistente',
      description: 'Faça login por 7 dias seguidos.',
      points: 80,
    },
    {
      title: 'Mestre das Missões',
      description: 'Complete todas as missões diárias.',
      points: 120,
    },
    {
      title: 'Lenda Viva',
      description: 'Seja o número 1 do ranking por 24 horas.',
      points: 500,
    },
  ];

  for (const mission of missions) {
    const existing = await prisma.mission.findFirst({
      where: { title: mission.title },
    });

    if (!existing) {
      await prisma.mission.create({ data: mission });
      console.log(`Missão criada: ${mission.title}`);
    } else {
      console.log(`Missão já existente: ${mission.title}, pulando.`);
    }
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
