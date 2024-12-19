-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "requires2FA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requires2FAExpiresAt" TIMESTAMP(3);
