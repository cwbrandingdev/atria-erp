"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_KANBAN_COLUMNS = void 0;
const client_1 = require("@prisma/client");
exports.DEFAULT_KANBAN_COLUMNS = [
    {
        title: 'A Fazer',
        order: 1,
        color: '#3B82F6',
        type: client_1.KanbanColumnType.TO_DO,
    },
    {
        title: 'Em Andamento',
        order: 2,
        color: '#F59E0B',
        type: client_1.KanbanColumnType.IN_PROGRESS,
    },
    {
        title: 'Concluído',
        order: 3,
        color: '#10B981',
        type: client_1.KanbanColumnType.DONE,
    },
];
//# sourceMappingURL=kanban-defaults.js.map