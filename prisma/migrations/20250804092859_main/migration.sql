-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bvn" TEXT,
ADD COLUMN     "dateOfBirth" TEXT,
ADD COLUMN     "disabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "idcard_url" TEXT,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "kyc_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nin" TEXT,
ADD COLUMN     "phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signup_otp" TEXT,
ADD COLUMN     "utility_bill_url" TEXT;
