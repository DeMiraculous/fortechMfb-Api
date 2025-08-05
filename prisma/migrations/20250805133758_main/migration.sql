/*
  Warnings:

  - The primary key for the `Kyc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Kyc` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[account_number]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `userId` on the `Kyc` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "account_type" AS ENUM ('SAVINGS', 'CURRENT');

-- CreateEnum
CREATE TYPE "transaction_list" AS ENUM ('TRANSFER', 'DEPOSIT', 'BILLS');

-- CreateEnum
CREATE TYPE "type" AS ENUM ('DEBIT', 'CREDIT');

-- DropForeignKey
ALTER TABLE "Kyc" DROP CONSTRAINT "Kyc_userId_fkey";

-- AlterTable
ALTER TABLE "Kyc" DROP CONSTRAINT "Kyc_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "account_number" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "account_number" TEXT NOT NULL,
    "account_type" "account_type",
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_history" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "transaction_type" "transaction_list" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "type" "type" NOT NULL,
    "previous_balance" DOUBLE PRECISION NOT NULL,
    "new_balance" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "reference" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "account_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_account_number_key" ON "account"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_userId_key" ON "Kyc"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_account_number_key" ON "User"("account_number");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_history" ADD CONSTRAINT "account_history_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kyc" ADD CONSTRAINT "Kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
