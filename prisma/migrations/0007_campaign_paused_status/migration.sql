DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'paused' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'campaign_status')) THEN
    ALTER TYPE "campaign_status" ADD VALUE 'paused';
  END IF;
END $$;
