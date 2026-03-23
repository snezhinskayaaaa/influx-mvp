-- AlterTable: Add payment provider fields to transactions
ALTER TABLE "transactions" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'confirmed';
ALTER TABLE "transactions" ADD COLUMN "external_id" TEXT;
ALTER TABLE "transactions" ADD COLUMN "external_status" TEXT;
ALTER TABLE "transactions" ADD COLUMN "wallet_address" TEXT;
ALTER TABLE "transactions" ADD COLUMN "network" TEXT;
ALTER TABLE "transactions" ADD COLUMN "currency" TEXT;
ALTER TABLE "transactions" ADD COLUMN "tx_hash" TEXT;
ALTER TABLE "transactions" ADD COLUMN "confirmed_at" TIMESTAMPTZ;
ALTER TABLE "transactions" ADD COLUMN "expires_at" TIMESTAMPTZ;

-- CreateIndex
CREATE INDEX "transactions_external_id_idx" ON "transactions"("external_id");
