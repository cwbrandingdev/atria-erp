-- AlterTable
ALTER TABLE "KanbanTask" ADD COLUMN "referenceUrl" TEXT;

-- AlterTable
ALTER TABLE "ContentPost" ADD COLUMN "referenceUrl" TEXT;

-- AlterTable
ALTER TABLE "AgencySettings" ADD COLUMN "slackWebhookUrl" TEXT,
ADD COLUMN "discordWebhookUrl" TEXT,
ADD COLUMN "notifyOnPostRejected" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "notifyOnContractSigned" BOOLEAN NOT NULL DEFAULT true;

-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'POST_REJECTED';
