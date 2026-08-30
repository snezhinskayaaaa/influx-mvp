-- Add referral_code to influencers
ALTER TABLE "influencers" ADD COLUMN "referral_code" TEXT;

-- Generate unique codes for existing influencers
UPDATE "influencers" SET "referral_code" = substr(md5(random()::text), 1, 10) WHERE "referral_code" IS NULL;

-- Make it NOT NULL and UNIQUE after populating
ALTER TABLE "influencers" ALTER COLUMN "referral_code" SET NOT NULL;
ALTER TABLE "influencers" ALTER COLUMN "referral_code" SET DEFAULT substr(md5(random()::text), 1, 10);
CREATE UNIQUE INDEX "influencers_referral_code_key" ON "influencers"("referral_code");

-- Create referrals table
CREATE TABLE "referrals" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "referrer_id" UUID NOT NULL,
    "referred_id" UUID NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "total_earnings" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE INDEX "idx_referrals_referrer" ON "referrals"("referrer_id");
CREATE INDEX "idx_referrals_referred" ON "referrals"("referred_id");
CREATE UNIQUE INDEX "referrals_referrer_id_referred_id_key" ON "referrals"("referrer_id", "referred_id");

-- Prevent self-referral
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_no_self_referral" CHECK ("referrer_id" != "referred_id");

-- Foreign keys
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
