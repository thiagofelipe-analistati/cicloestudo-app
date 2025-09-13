-- CreateTable
CREATE TABLE "Disciplina" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disciplina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "urlEstudo" TEXT,
    "comentarios" TEXT,
    "totalQuestoes" INTEGER NOT NULL DEFAULT 0,
    "acertosQuestoes" INTEGER NOT NULL DEFAULT 0,
    "errosQuestoes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "disciplinaId" TEXT NOT NULL,

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Disciplina_nome_key" ON "Disciplina"("nome");

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "Disciplina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
