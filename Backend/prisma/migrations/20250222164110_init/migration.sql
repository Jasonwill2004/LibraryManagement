/*
  Warnings:

  - You are about to drop the column `mem_id` on the `Issuance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Issuance" DROP CONSTRAINT "Issuance_mem_id_fkey";

-- AlterTable
ALTER TABLE "Issuance" DROP COLUMN "mem_id";

-- AddForeignKey
ALTER TABLE "Issuance" ADD CONSTRAINT "Issuance_issuance_member_fkey" FOREIGN KEY ("issuance_member") REFERENCES "Member"("mem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
