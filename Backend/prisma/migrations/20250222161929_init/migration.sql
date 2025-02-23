/*
  Warnings:

  - Added the required column `mem_id` to the `Issuance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Issuance" ADD COLUMN     "mem_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Issuance" ADD CONSTRAINT "Issuance_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "Book"("book_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Issuance" ADD CONSTRAINT "Issuance_mem_id_fkey" FOREIGN KEY ("mem_id") REFERENCES "Member"("mem_id") ON DELETE RESTRICT ON UPDATE CASCADE;
