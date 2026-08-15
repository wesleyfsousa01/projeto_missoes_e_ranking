/*
  Warnings:

  - The primary key for the `player_missions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `player_missions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "mission_prerequisites" DROP CONSTRAINT "mission_prerequisites_missionId_fkey";

-- DropForeignKey
ALTER TABLE "mission_prerequisites" DROP CONSTRAINT "mission_prerequisites_prerequisiteId_fkey";

-- DropForeignKey
ALTER TABLE "player_missions" DROP CONSTRAINT "player_missions_missionId_fkey";

-- DropForeignKey
ALTER TABLE "player_missions" DROP CONSTRAINT "player_missions_playerId_fkey";

-- DropIndex
DROP INDEX "player_missions_playerId_missionId_key";

-- AlterTable
ALTER TABLE "player_missions" DROP CONSTRAINT "player_missions_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "player_missions_pkey" PRIMARY KEY ("playerId", "missionId");

-- CreateIndex
CREATE INDEX "players_score_idx" ON "players"("score" DESC);

-- AddForeignKey
ALTER TABLE "player_missions" ADD CONSTRAINT "player_missions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "player_missions" ADD CONSTRAINT "player_missions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_prerequisites" ADD CONSTRAINT "mission_prerequisites_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mission_prerequisites" ADD CONSTRAINT "mission_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
