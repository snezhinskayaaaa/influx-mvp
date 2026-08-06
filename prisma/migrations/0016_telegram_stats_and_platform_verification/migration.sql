-- Add telegram followers and avg views
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "telegram_followers" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "telegram_avg_views" INTEGER NOT NULL DEFAULT 0;

-- Add per-platform verification flags
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "twitter_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "instagram_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "tiktok_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "youtube_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "telegram_verified" BOOLEAN NOT NULL DEFAULT false;
