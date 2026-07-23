import {
  ContentPlatform,
  ContentPostFormat,
  ContentPostStatus,
  ContractStatus,
  EventCategory,
  KanbanTaskPriority,
  PaymentFrequency,
  PrismaClient,
  TransactionType,
} from '@prisma/client';
import { DEFAULT_KANBAN_COLUMNS } from '../src/kanban/kanban-defaults';

const prisma = new PrismaClient();

const categories = [
  { name: 'Projetos', type: TransactionType.INCOME, color: '#004949' },
  { name: 'Retainer', type: TransactionType.INCOME, color: '#006666' },
  { name: 'Contratos', type: TransactionType.INCOME, color: '#004949' },
  { name: 'Consultoria', type: TransactionType.INCOME, color: '#E8C39E' },
  { name: 'Outros (Receita)', type: TransactionType.INCOME, color: '#2D6A6A' },
  { name: 'Ferramentas', type: TransactionType.EXPENSE, color: '#004949' },
  { name: 'Equipe', type: TransactionType.EXPENSE, color: '#E8C39E' },
  { name: 'Marketing', type: TransactionType.EXPENSE, color: '#006666' },
  { name: 'Escritório', type: TransactionType.EXPENSE, color: '#2D6A6A' },
  { name: 'Outros (Despesa)', type: TransactionType.EXPENSE, color: '#8B7355' },
];

async function main() {
  const roles = [
    { name: 'ADMIN' as const, description: 'Full system access' },
    { name: 'MANAGER' as const, description: 'Team and project management' },
    { name: 'USER' as const, description: 'Standard user access' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  for (const category of categories) {
    await prisma.financialCategory.upsert({
      where: {
        name_type: { name: category.name, type: category.type },
      },
      update: { color: category.color },
      create: category,
    });
  }

  const admin = await prisma.user.findUnique({
    where: { email: 'admin@atria.com' },
  });

  if (admin) {
    const existingCount = await prisma.financialTransaction.count({
      where: { userId: admin.id },
    });

    if (existingCount === 0) {
      const incomeCategories = await prisma.financialCategory.findMany({
        where: { type: TransactionType.INCOME },
      });
      const expenseCategories = await prisma.financialCategory.findMany({
        where: { type: TransactionType.EXPENSE },
      });

      const now = new Date();
      const sampleTransactions = [
        {
          description: 'Projeto Branding — Cliente A',
          amount: 12500,
          type: TransactionType.INCOME,
          status: 'PAID' as const,
          date: new Date(now.getFullYear(), now.getMonth(), 20),
          categoryId: incomeCategories[0].id,
        },
        {
          description: 'Assinatura Adobe Creative Cloud',
          amount: 890,
          type: TransactionType.EXPENSE,
          status: 'PAID' as const,
          date: new Date(now.getFullYear(), now.getMonth(), 18),
          categoryId: expenseCategories[0].id,
        },
        {
          description: 'Campanha Social Media — Cliente B',
          amount: 8200,
          type: TransactionType.INCOME,
          status: 'PAID' as const,
          date: new Date(now.getFullYear(), now.getMonth(), 15),
          categoryId: incomeCategories[0].id,
        },
        {
          description: 'Freelancer — Edição de vídeo',
          amount: 2400,
          type: TransactionType.EXPENSE,
          status: 'PENDING' as const,
          date: new Date(now.getFullYear(), now.getMonth(), 12),
          categoryId: expenseCategories[1].id,
        },
        {
          description: 'Retainer Mensal — Cliente C',
          amount: 15000,
          type: TransactionType.INCOME,
          status: 'PAID' as const,
          date: new Date(now.getFullYear(), now.getMonth(), 1),
          categoryId: incomeCategories[1].id,
        },
        {
          description: 'Anúncios Google Ads',
          amount: 1500,
          type: TransactionType.EXPENSE,
          status: 'OVERDUE' as const,
          date: new Date(now.getFullYear(), now.getMonth() - 1, 28),
          categoryId: expenseCategories[2].id,
        },
      ];

      for (const tx of sampleTransactions) {
        await prisma.financialTransaction.create({
          data: { ...tx, userId: admin.id },
        });
      }

      console.log(`Seeded ${sampleTransactions.length} sample transactions`);
    }

    const eventCount = await prisma.calendarEvent.count();
    if (eventCount === 0) {
      const now = new Date();
      const events = [
        {
          title: 'Alinhamento com Design',
          description: 'Revisão de layouts e identidade visual',
          startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0),
          endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 0),
          category: EventCategory.MEETING,
          isPending: false,
          createdById: admin.id,
          assigneeId: admin.id,
        },
        {
          title: 'Deadline — Campanha Social',
          description: 'Entrega final dos criativos',
          startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 9, 0),
          endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 18, 0),
          category: EventCategory.DEADLINE,
          isPending: true,
          createdById: admin.id,
        },
        {
          title: 'Publicação Instagram',
          startAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 0),
          endAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 10, 30),
          category: EventCategory.PUBLISH,
          isPending: true,
          createdById: admin.id,
          assigneeId: admin.id,
        },
      ];

      for (const event of events) {
        await prisma.calendarEvent.create({ data: event });
      }
      console.log(`Seeded ${events.length} calendar events`);
    }

    const columnCount = await prisma.kanbanColumn.count();
    if (columnCount === 0) {
      const columns = await Promise.all(
        DEFAULT_KANBAN_COLUMNS.map((column) =>
          prisma.kanbanColumn.create({ data: { ...column } }),
        ),
      );

      const [todo, inProgress, done] = columns;

      const tasks = [
        {
          title: 'Briefing Cliente X',
          description: 'Revisar documento de briefing',
          columnId: todo.id,
          priority: KanbanTaskPriority.CRITICAL,
          order: 0,
          createdById: admin.id,
        },
        {
          title: 'Roteiro Reels',
          description: 'Criar roteiro para campanha de verão',
          columnId: todo.id,
          priority: KanbanTaskPriority.PLANNED,
          order: 1,
          createdById: admin.id,
        },
        {
          title: 'Design Post Instagram',
          columnId: inProgress.id,
          priority: KanbanTaskPriority.MEDIUM,
          order: 0,
          createdById: admin.id,
          assigneeIds: [admin.id],
        },
        {
          title: 'Vídeo TikTok',
          description: 'Aguardando aprovação do cliente',
          columnId: inProgress.id,
          priority: KanbanTaskPriority.HIGH,
          order: 1,
          createdById: admin.id,
        },
        {
          title: 'Calendário Editorial',
          columnId: done.id,
          priority: KanbanTaskPriority.LOW,
          order: 0,
          createdById: admin.id,
          assigneeIds: [admin.id],
        },
      ];

      for (const task of tasks) {
        const { assigneeIds, ...taskData } = task;
        const created = await prisma.kanbanTask.create({
          data: {
            ...taskData,
            assignees: assigneeIds?.length
              ? { create: assigneeIds.map((userId) => ({ userId })) }
              : undefined,
          },
        });

        await prisma.taskHistory.create({
          data: {
            taskId: created.id,
            userId: admin.id,
            action: 'Tarefa criada',
          },
        });
      }

      console.log(`Seeded ${columns.length} kanban columns and ${tasks.length} tasks`);
    }

    const clientCount = await prisma.client.count();
    if (clientCount === 0) {
      const clients = [
        {
          companyName: 'Moda Verão Ltda',
          contactName: 'Ana Silva',
          email: 'contato@modaverao.com.br',
          phone: '(11) 98765-4321',
          instagram: '@modaverao',
          website: 'https://modaverao.com.br',
          street: 'Rua das Flores',
          number: '120',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          notes: 'Cliente premium — foco em Instagram e TikTok.',
        },
        {
          companyName: 'TechStart Inovação',
          contactName: 'Carlos Mendes',
          email: 'marketing@techstart.io',
          phone: '(21) 99876-5432',
          instagram: '@techstart.io',
          website: 'https://techstart.io',
          street: 'Av. Paulista',
          number: '1500',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-200',
        },
        {
          companyName: 'Boutique Elegance',
          contactName: 'Mariana Costa',
          email: 'hello@boutiqueelegance.com',
          phone: '(31) 97654-3210',
          instagram: '@boutiqueelegance',
          city: 'Belo Horizonte',
          state: 'MG',
        },
      ];

      for (const client of clients) {
        await prisma.client.create({ data: client });
      }
      console.log(`Seeded ${clients.length} clients`);
    }

    const postCount = await prisma.contentPost.count();
    if (postCount === 0) {
      const clients = await prisma.client.findMany({ take: 3 });
      const [moda, tech, boutique] = clients;
      const now = new Date();
      const posts = [
        {
          title: 'Reels — Lançamento Produto Verão',
          platform: ContentPlatform.INSTAGRAM,
          format: ContentPostFormat.REELS,
          scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 18, 0),
          status: ContentPostStatus.SCHEDULED,
          copy: 'Confira o novo lançamento da coleção verão! ☀️ #moda #verao',
          userId: admin.id,
          clientId: moda?.id,
        },
        {
          title: 'Tutorial TikTok — Behind the Scenes',
          platform: ContentPlatform.TIKTOK,
          format: ContentPostFormat.REELS,
          status: ContentPostStatus.DRAFT,
          copy: 'Rascunho do roteiro para vídeo behind the scenes da produção.',
          userId: admin.id,
          clientId: tech?.id,
        },
        {
          title: 'Vídeo YouTube — Case de Sucesso',
          platform: ContentPlatform.YOUTUBE,
          format: ContentPostFormat.STATIC,
          scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 12, 0),
          status: ContentPostStatus.PENDING_APPROVAL,
          copy: 'Case completo do cliente X com resultados do Q2.',
          userId: admin.id,
          clientId: tech?.id,
        },
        {
          title: 'Post LinkedIn — Insights de Marketing',
          platform: ContentPlatform.LINKEDIN,
          format: ContentPostFormat.STATIC,
          scheduledDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3, 9, 0),
          status: ContentPostStatus.PUBLISHED,
          copy: '5 tendências de marketing digital para 2026.',
          userId: admin.id,
          clientId: boutique?.id,
        },
        {
          title: 'Carrossel Instagram — Dicas de Branding',
          platform: ContentPlatform.INSTAGRAM,
          format: ContentPostFormat.CAROUSEL,
          status: ContentPostStatus.DRAFT,
          copy: 'Rascunho do carrossel com 7 dicas de branding para PMEs.',
          userId: admin.id,
          clientId: moda?.id,
        },
      ].filter((p) => p.clientId);

      for (const post of posts) {
        await prisma.contentPost.create({ data: post });
      }
      console.log(`Seeded ${posts.length} content posts`);
    }

    const contractCount = await prisma.contract.count();
    if (contractCount === 0 && admin) {
      const clients = await prisma.client.findMany({ take: 2 });
      if (clients.length > 0) {
        const terms = `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

As partes acordam os termos de prestação de serviços de marketing digital, incluindo gestão de redes sociais, produção de conteúdo e relatórios mensais de performance.

O pagamento será realizado conforme a frequência acordada neste contrato.`;

        await prisma.contract.create({
          data: {
            clientId: clients[0].id,
            title: 'Contrato de Marketing Digital — Retainer Mensal',
            status: ContractStatus.SENT,
            recurringValue: 4500,
            paymentFrequency: PaymentFrequency.MONTHLY,
            startDate: new Date(),
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 11)),
            termsContent: terms,
            createdById: admin.id,
          },
        });

        await prisma.contract.create({
          data: {
            clientId: clients[1]?.id ?? clients[0].id,
            title: 'Projeto Pontual — Campanha de Lançamento',
            status: ContractStatus.DRAFT,
            recurringValue: 12000,
            paymentFrequency: PaymentFrequency.ONE_TIME,
            startDate: new Date(),
            termsContent: terms,
            createdById: admin.id,
          },
        });

        console.log('Seeded sample contracts');
      }
    }
  }

  console.log('Seeded roles and financial categories');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
