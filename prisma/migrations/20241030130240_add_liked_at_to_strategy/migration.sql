/*
  Warnings:

  - You are about to drop the `_UserLikesStrategies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserLikesStrategies" DROP CONSTRAINT "_UserLikesStrategies_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserLikesStrategies" DROP CONSTRAINT "_UserLikesStrategies_B_fkey";

-- DropTable
DROP TABLE "_UserLikesStrategies";

-- CreateTable
CREATE TABLE "UserStrategyLike" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "strategyId" INTEGER NOT NULL,
    "likedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserStrategyLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStrategyLike_userId_strategyId_key" ON "UserStrategyLike"("userId", "strategyId");

-- AddForeignKey
ALTER TABLE "UserStrategyLike" ADD CONSTRAINT "UserStrategyLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStrategyLike" ADD CONSTRAINT "UserStrategyLike_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
