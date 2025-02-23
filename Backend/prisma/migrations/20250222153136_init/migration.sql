-- CreateTable
CREATE TABLE "Issuance" (
    "issuance_id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "issuance_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuance_member" INTEGER NOT NULL,
    "issued_by" TEXT NOT NULL,
    "target_return_date" TIMESTAMP(3) NOT NULL,
    "issuance_status" TEXT NOT NULL,

    CONSTRAINT "Issuance_pkey" PRIMARY KEY ("issuance_id")
);
