/*
  Warnings:

  - Added the required column `sellerId` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Coupon" ADD COLUMN     "sellerId" TEXT NOT NULL;
