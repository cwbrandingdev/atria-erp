-- CreateTable
CREATE TABLE "ClientBrief" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'portal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientBrief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientBrief_clientId_createdAt_idx" ON "ClientBrief"("clientId", "createdAt");

-- AddForeignKey
ALTER TABLE "ClientBrief" ADD CONSTRAINT "ClientBrief_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
