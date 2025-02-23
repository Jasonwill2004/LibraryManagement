-- CreateTable
CREATE TABLE "Member" (
    "mem_id" SERIAL NOT NULL,
    "mem_name" TEXT NOT NULL,
    "mem_phone" TEXT NOT NULL,
    "mem_email" TEXT NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("mem_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_mem_email_key" ON "Member"("mem_email");
