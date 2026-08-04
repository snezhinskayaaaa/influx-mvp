-- AlterTable
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "published_urls" TEXT[] DEFAULT '{}';
