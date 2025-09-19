/*
  Warnings:

  - Added the required column `userId` to the `CicloItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CicloItem" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CicloItem" ADD CONSTRAINT "CicloItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
