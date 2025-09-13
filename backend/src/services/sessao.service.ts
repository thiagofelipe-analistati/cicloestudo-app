import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Omitimos os campos automáticos e de relacionamento do tipo de entrada
type SessaoCreateData = {
  tempoEstudado: number;
  categoria: string;
  totalQuestoes?: number;
  acertosQuestoes?: number;
  errosQuestoes?: number;
  paginasLidas?: number;
  comentarios?: string;
  disciplinaId: string;
  topicoId?: string;
};

export const sessaoService = {
  create: async (data: SessaoCreateData) => {
    return await prisma.sessaoEstudo.create({
      data: {
        tempoEstudado: data.tempoEstudado,
        categoria: data.categoria,
        totalQuestoes: data.totalQuestoes,
        acertosQuestoes: data.acertosQuestoes,
        errosQuestoes: data.errosQuestoes,
        paginasLidas: data.paginasLidas,
        comentarios: data.comentarios,
        disciplina: { connect: { id: data.disciplinaId } },
        topico: data.topicoId ? { connect: { id: data.topicoId } } : undefined,
      },
    });
  },

  getAll: async () => {
    return await prisma.sessaoEstudo.findMany({
      // Ordena as sessões da mais recente para a mais antiga
      orderBy: { data: 'desc' },
    });
  },
};