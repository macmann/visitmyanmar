CREATE TABLE "ProgressionAward" (
  "id" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "xp" INTEGER NOT NULL,
  "score" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProgressionAward_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProgressionAward_playerId_sourceType_sourceId_key" ON "ProgressionAward"("playerId", "sourceType", "sourceId");
CREATE INDEX "ProgressionAward_playerId_createdAt_idx" ON "ProgressionAward"("playerId", "createdAt");
ALTER TABLE "ProgressionAward" ADD CONSTRAINT "ProgressionAward_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
