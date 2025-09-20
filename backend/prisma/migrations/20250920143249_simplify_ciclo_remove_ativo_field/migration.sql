/*
  Warnings:

  - You are about to drop the column `ativo` on the `Ciclo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ciclo" DROP COLUMN "ativo",
ADD COLUMN     "conclusoes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ordemItemAtual" INTEGER NOT NULL DEFAULT 1;
