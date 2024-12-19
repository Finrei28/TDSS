/*
  Warnings:

  - You are about to drop the column `requires2FA` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "requires2FA",
ADD COLUMN     "verificationToken" TEXT,
ADD COLUMN     "verificationTokenExpiresAt" TIMESTAMP(3);
