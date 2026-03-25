ALTER TABLE "influencers" ADD COLUMN "twitter_handle" TEXT;
ALTER TABLE "influencers" ADD COLUMN "twitter_followers" INTEGER NOT NULL DEFAULT 0;
