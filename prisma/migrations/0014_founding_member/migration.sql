-- Add founding member fields to influencers
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "founding_member" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "influencers" ADD COLUMN IF NOT EXISTS "founding_member_at" TIMESTAMPTZ;

-- Add founding member fields to brands
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "founding_member" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "brands" ADD COLUMN IF NOT EXISTS "founding_member_at" TIMESTAMPTZ;
