-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('influencer', 'brand', 'admin');

-- CreateEnum
CREATE TYPE "campaign_status" AS ENUM ('draft', 'active', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "influencer_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "collaboration_status" AS ENUM ('applied', 'negotiating', 'agreed', 'in_progress', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('deposit', 'withdrawal', 'campaign_freeze', 'campaign_unfreeze', 'campaign_payout');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT,
    "role" "user_role" NOT NULL DEFAULT 'influencer',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "influencers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "handle" TEXT NOT NULL,
    "bio" TEXT,
    "niche" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "instagram_handle" TEXT,
    "instagram_followers" INTEGER NOT NULL DEFAULT 0,
    "instagram_engagement" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "tiktok_handle" TEXT,
    "tiktok_followers" INTEGER NOT NULL DEFAULT 0,
    "tiktok_engagement" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "youtube_handle" TEXT,
    "youtube_subscribers" INTEGER NOT NULL DEFAULT 0,
    "youtube_engagement" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "price_per_post" INTEGER,
    "price_per_story" INTEGER,
    "price_per_video" INTEGER,
    "portfolio_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "past_collaborations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "influencer_status" NOT NULL DEFAULT 'pending',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "influencers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "company_name" TEXT NOT NULL,
    "industry" TEXT,
    "website" TEXT,
    "description" TEXT,
    "logo_url" TEXT,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "monthly_budget_range" TEXT,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "frozen_balance" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "brand_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "budget_min" INTEGER NOT NULL,
    "budget_max" INTEGER NOT NULL,
    "desired_influencer_count" INTEGER NOT NULL DEFAULT 1,
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "campaign_status" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campaign_id" UUID NOT NULL,
    "influencer_id" UUID NOT NULL,
    "proposed_price" INTEGER NOT NULL,
    "agreed_price" INTEGER,
    "status" "collaboration_status" NOT NULL DEFAULT 'applied',
    "brand_agreed" BOOLEAN NOT NULL DEFAULT false,
    "influencer_agreed" BOOLEAN NOT NULL DEFAULT false,
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "message" TEXT,
    "frozen_at" TIMESTAMPTZ,
    "completed_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "type" "transaction_type" NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "reference_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "deposit_fee_percent" DECIMAL(5,2) NOT NULL DEFAULT 2.0,
    "withdrawal_fee_percent" DECIMAL(5,2) NOT NULL DEFAULT 3.0,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "platform_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sender_id" UUID NOT NULL,
    "recipient_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "role" TEXT,
    "instagram_handle" TEXT,
    "follower_count" TEXT,
    "company_name" TEXT,
    "industry" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_user_id_key" ON "influencers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "influencers_handle_key" ON "influencers"("handle");

-- CreateIndex
CREATE INDEX "idx_influencers_status" ON "influencers"("status");

-- CreateIndex
CREATE INDEX "idx_influencers_verified" ON "influencers"("is_verified");

-- CreateIndex
CREATE INDEX "idx_influencers_featured" ON "influencers"("is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "brands_user_id_key" ON "brands"("user_id");

-- CreateIndex
CREATE INDEX "idx_campaigns_brand" ON "campaigns"("brand_id");

-- CreateIndex
CREATE INDEX "idx_campaigns_status" ON "campaigns"("status");

-- CreateIndex
CREATE INDEX "collaborations_campaign_id_idx" ON "collaborations"("campaign_id");

-- CreateIndex
CREATE INDEX "collaborations_influencer_id_idx" ON "collaborations"("influencer_id");

-- CreateIndex
CREATE INDEX "collaborations_status_idx" ON "collaborations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_campaign_id_influencer_id_key" ON "collaborations"("campaign_id", "influencer_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "idx_messages_recipient" ON "messages"("recipient_id");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist"("email");

-- AddForeignKey
ALTER TABLE "influencers" ADD CONSTRAINT "influencers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collaborations" ADD CONSTRAINT "collaborations_influencer_id_fkey" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

