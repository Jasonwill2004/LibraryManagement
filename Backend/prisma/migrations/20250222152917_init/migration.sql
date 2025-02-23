-- CreateTable
CREATE TABLE "Book" (
    "book_id" SERIAL NOT NULL,
    "book_name" TEXT NOT NULL,
    "book_launch_date" TIMESTAMP(3) NOT NULL,
    "book_publisher" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);
