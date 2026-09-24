CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "save" JSONB NOT NULL,
    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PersistentAction" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completesAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    CONSTRAINT "PersistentAction_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PersistentAction_playerId_completesAt_idx" ON "PersistentAction"("playerId", "completesAt");
ALTER TABLE "PersistentAction" ADD CONSTRAINT "PersistentAction_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
