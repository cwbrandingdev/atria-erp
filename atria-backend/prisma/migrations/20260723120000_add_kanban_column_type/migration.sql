-- CreateEnum
CREATE TYPE "KanbanColumnType" AS ENUM ('TO_DO', 'IN_PROGRESS', 'DONE', 'CUSTOM');

-- AlterTable
ALTER TABLE "KanbanColumn" ADD COLUMN "type" "KanbanColumnType";
