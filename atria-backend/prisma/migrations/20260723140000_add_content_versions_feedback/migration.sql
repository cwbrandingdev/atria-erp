-- AlterEnum
ALTER TYPE "ContentPostStatus" ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE "ContentPostStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

-- CreateEnum
CREATE TYPE "PostFeedbackType" AS ENUM ('REJECTION_REASON', 'GENERAL_NOTE');

-- CreateTable
CREATE TABLE "PostVersion" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "copyText" TEXT NOT NULL,
    "mediaUrls" TEXT[],
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostFeedback" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "versionId" TEXT,
    "userId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "type" "PostFeedbackType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostVersion_postId_idx" ON "PostVersion"("postId");

-- CreateIndex
CREATE INDEX "PostVersion_createdById_idx" ON "PostVersion"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "PostVersion_postId_versionNumber_key" ON "PostVersion"("postId", "versionNumber");

-- CreateIndex
CREATE INDEX "PostFeedback_postId_idx" ON "PostFeedback"("postId");

-- CreateIndex
CREATE INDEX "PostFeedback_versionId_idx" ON "PostFeedback"("versionId");

-- CreateIndex
CREATE INDEX "PostFeedback_userId_idx" ON "PostFeedback"("userId");

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostVersion" ADD CONSTRAINT "PostVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_postId_fkey" FOREIGN KEY ("postId") REFERENCES "ContentPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "PostVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostFeedback" ADD CONSTRAINT "PostFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
