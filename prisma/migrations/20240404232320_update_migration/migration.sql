/*
  Warnings:

  - You are about to drop the column `person_id` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `personId` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_person_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "person_id",
ADD COLUMN     "personId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
