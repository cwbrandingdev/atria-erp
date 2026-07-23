import { KanbanColumnType } from '@prisma/client';

export const DEFAULT_KANBAN_COLUMNS = [
  {
    title: 'A Fazer',
    order: 1,
    color: '#3B82F6',
    type: KanbanColumnType.TO_DO,
  },
  {
    title: 'Em Andamento',
    order: 2,
    color: '#F59E0B',
    type: KanbanColumnType.IN_PROGRESS,
  },
  {
    title: 'Concluído',
    order: 3,
    color: '#10B981',
    type: KanbanColumnType.DONE,
  },
] as const;
