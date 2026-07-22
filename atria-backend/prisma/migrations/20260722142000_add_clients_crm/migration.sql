-- CreateEnum
CREATE TYPE "ContentPostFormat" AS ENUM ('CAROUSEL', 'REELS', 'STATIC', 'STORY');

-- AlterEnum
ALTER TYPE "ContentPostStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "instagram" TEXT,
    "website" TEXT,
    "street" TEXT,
    "number" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "notes" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Client_companyName_idx" ON "Client"("companyName");

-- AlterTable ContentPost
ALTER TABLE "ContentPost" ADD COLUMN "format" "ContentPostFormat" NOT NULL DEFAULT 'STATIC';
ALTER TABLE "ContentPost" ADD COLUMN "clientId" TEXT;
ALTER TABLE "ContentPost" ADD COLUMN "assigneeId" TEXT;

-- Create default client for existing posts
INSERT INTO "Client" ("id", "companyName", "updatedAt")
SELECT gen_random_uuid()::text, 'Cliente Padrão', NOW()
WHERE NOT EXISTS (SELECT 1 FROM "Client" LIMIT 1);

UPDATE "ContentPost"
SET "clientId" = (SELECT "id" FROM "Client" LIMIT 1)
WHERE "clientId" IS NULL;

ALTER TABLE "ContentPost" ALTER COLUMN "clientId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentPost" ADD CONSTRAINT "ContentPost_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "ContentPost_clientId_idx" ON "ContentPost"("clientId");
