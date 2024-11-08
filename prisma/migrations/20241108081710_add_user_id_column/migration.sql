/*
  Warnings:

  - Added the required column `user_id` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "user_id" TEXT NOT NULL;
