-- DropForeignKey
ALTER TABLE "SessaoEstudo" DROP CONSTRAINT "SessaoEstudo_disciplinaId_fkey";

-- DropForeignKey
ALTER TABLE "Topico" DROP CONSTRAINT "Topico_disciplinaId_fkey";

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessaoEstudo" ADD CONSTRAINT "SessaoEstudo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
