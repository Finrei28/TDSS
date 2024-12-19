-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_strategyId_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE CASCADE ON UPDATE CASCADE;
