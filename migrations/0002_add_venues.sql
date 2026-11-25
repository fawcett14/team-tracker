-- Add venue support: per-game venue and team default home venue
ALTER TABLE "Team" ADD COLUMN "homeVenue" TEXT;
ALTER TABLE "Game" ADD COLUMN "venue" TEXT;
