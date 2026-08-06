-- Add 2FA fields to profiles
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "totp_secret" TEXT;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "totp_enabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "totp_backup_codes" TEXT[] DEFAULT '{}';
