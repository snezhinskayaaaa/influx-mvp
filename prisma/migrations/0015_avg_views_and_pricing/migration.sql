-- Add average views per platform
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "instagram_avg_views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "tiktok_avg_views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "youtube_avg_views" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "twitter_avg_views" INTEGER NOT NULL DEFAULT 0;

-- Add simplified pricing fields
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "cpm_rate" INTEGER;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "cpc_rate" INTEGER;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "cpe_rate" INTEGER;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "average_post_price" INTEGER;
