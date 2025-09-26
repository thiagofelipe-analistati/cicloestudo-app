-- CreateEnum
CREATE TYPE "StatusRevisao" AS ENUM ('PENDENTE', 'CONCLUIDA', 'ATRASADA');

-- AlterTable
ALTER TABLE "Topico" ADD COLUMN     "concluido" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Revisao" (
    "id" TEXT NOT NULL,
    "dataAgendada" TIMESTAMP(3) NOT NULL,
    "status" "StatusRevisao" NOT NULL DEFAULT 'PENDENTE',
    "topicoId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revisao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Revisao" ADD CONSTRAINT "Revisao_topicoId_fkey" FOREIGN KEY ("topicoId") REFERENCES "Topico"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revisao" ADD CONSTRAINT "Revisao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
