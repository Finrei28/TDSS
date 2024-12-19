-- DropForeignKey
ALTER TABLE "PlayerData" DROP CONSTRAINT "PlayerData_playerId_fkey";

-- AddForeignKey
ALTER TABLE "PlayerData" ADD CONSTRAINT "PlayerData_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
