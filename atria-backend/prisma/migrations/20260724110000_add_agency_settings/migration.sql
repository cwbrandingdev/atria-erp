-- CreateTable
CREATE TABLE "AgencySettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "agencyName" TEXT NOT NULL DEFAULT 'ATRIA ERP',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#004949',
    "accentColor" TEXT NOT NULL DEFAULT '#E8C39E',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgencySettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "AgencySettings" ("id", "agencyName", "updatedAt")
VALUES ('default', 'ATRIA ERP', CURRENT_TIMESTAMP);
