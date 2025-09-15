import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// A definição do tipo precisa estar aqui, antes de ser usada.
type SessaoCreateData = {
  data: string | Date;
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
  create: async (data: SessaoCreateData, userId: string) => {
    return await prisma.sessaoEstudo.create({
      data: {
        data: new Date(data.data),
        tempoEstudado: data.tempoEstudado,
        categoria: data.categoria,
        totalQuestoes: data.totalQuestoes,
        acertosQuestoes: data.acertosQuestoes,
        errosQuestoes: data.errosQuestoes,
        paginasLidas: data.paginasLidas,
        comentarios: data.comentarios,
        userId: userId,
        disciplinaId: data.disciplinaId,
        topicoId: data.topicoId || null,
      },
    });
  },

  getAll: async (filters: { disciplinaId?: string; dataInicio?: string; dataFim?: string; }, userId: string) => {
    const where: any = { userId };

    if (filters.disciplinaId) {
      where.disciplinaId = filters.disciplinaId;
    }
    if (filters.dataInicio || filters.dataFim) {
      where.data = {};
      if (filters.dataInicio) { where.data.gte = new Date(filters.dataInicio); }
      if (filters.dataFim) {
        const dataFimAjustada = new Date(filters.dataFim);
        dataFimAjustada.setUTCHours(23, 59, 59, 999);
        where.data.lte = dataFimAjustada;
      }
    }
    return await prisma.sessaoEstudo.findMany({
      where,
      include: {
        disciplina: { select: { nome: true } },
        topico: { select: { nome: true } },
      },
      orderBy: { data: 'desc' },
    });
  },
};