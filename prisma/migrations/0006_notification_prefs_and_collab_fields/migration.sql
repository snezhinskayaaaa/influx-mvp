-- Add notification preferences to profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "email_notifications" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "campaign_updates" BOOLEAN NOT NULL DEFAULT true;

-- Add new collaboration lifecycle fields
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "content_url" TEXT;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "published_url" TEXT;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "revision_note" TEXT;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "revision_count" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "dispute_reason" TEXT;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "dispute_result" TEXT;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "advance_paid_at" TIMESTAMPTZ;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "delivered_at" TIMESTAMPTZ;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "disputed_at" TIMESTAMPTZ;
ALTER TABLE "collaborations" ADD COLUMN IF NOT EXISTS "resolved_at" TIMESTAMPTZ;

-- Add new enum values to collaboration_status
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'content_review' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'content_review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'revision' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'revision';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'publishing' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'publishing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'delivered' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'delivered';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'disputed' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'disputed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'resolved' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'collaboration_status')) THEN
    ALTER TYPE "collaboration_status" ADD VALUE 'resolved';
  END IF;
END $$;

-- Add new enum values to transaction_type
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'campaign_advance' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
    ALTER TYPE "transaction_type" ADD VALUE 'campaign_advance';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'advance_refund' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
    ALTER TYPE "transaction_type" ADD VALUE 'advance_refund';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'campaign_payout_auto' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
    ALTER TYPE "transaction_type" ADD VALUE 'campaign_payout_auto';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'dispute_payout' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
    ALTER TYPE "transaction_type" ADD VALUE 'dispute_payout';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'dispute_refund' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'transaction_type')) THEN
    ALTER TYPE "transaction_type" ADD VALUE 'dispute_refund';
  END IF;
END $$;

-- Drop messages table if it exists (removed from schema)
DROP TABLE IF EXISTS "messages";
