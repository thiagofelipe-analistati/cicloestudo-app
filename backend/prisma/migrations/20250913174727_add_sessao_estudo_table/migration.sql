-- CreateTable
CREATE TABLE "SessaoEstudo" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tempoEstudado" INTEGER NOT NULL,
    "categoria" TEXT NOT NULL,
    "totalQuestoes" INTEGER,
    "acertosQuestoes" INTEGER,
    "errosQuestoes" INTEGER,
    "paginasLidas" INTEGER,
    "comentarios" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "topicoId" TEXT,

    CONSTRAINT "SessaoEstudo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SessaoEstudo" ADD CONSTRAINT "SessaoEstudo_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessaoEstudo" ADD CONSTRAINT "SessaoEstudo_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
