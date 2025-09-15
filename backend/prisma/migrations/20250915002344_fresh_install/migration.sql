/*
  Warnings:

  - Added the required column `userId` to the `Disciplina` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SessaoEstudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Topico` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Disciplina_nome_key";

-- AlterTable
ALTER TABLE "Disciplina" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SessaoEstudo" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "data" DROP DEFAULT,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Topico" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Disciplina" ADD CONSTRAINT "Disciplina_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessaoEstudo" ADD CONSTRAINT "SessaoEstudo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
