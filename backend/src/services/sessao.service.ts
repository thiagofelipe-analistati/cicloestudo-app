// src/services/sessao.service.ts

import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns'; // Precisaremos desta biblioteca para adicionar dias
const prisma = new PrismaClient();
// Tipo de dados recebido do frontend
type SessaoCreateData = {
  data: string | Date;
  tempoEstudado: number;
  categoria: string;
  disciplinaId: string;
  topicoId?: string;
  totalQuestoes?: number;
  acertosQuestoes?: number;
  errosQuestoes?: number;
  paginasLidas?: number;
  comentarios?: string;
  concluiuTopico?: boolean;
  agendarRevisao?: boolean;
  revisaoId?: string; // <-- ADEQUAÇÃO: Campo opcional para identificar a revisão
};

export const sessaoService = {
  create: async (data: SessaoCreateData, userId: string) => {
    return await prisma.$transaction(async (tx) => {
      // 1. Cria a sessão de estudo principal (código original mantido)
      const novaSessao = await tx.sessaoEstudo.create({
        data: {
          data: new Date(data.data),
          tempoEstudado: data.tempoEstudado,
          categoria: data.categoria,
          totalQuestoes: Number(data.totalQuestoes) || 0,
          acertosQuestoes: Number(data.acertosQuestoes) || 0,
          errosQuestoes: Number(data.errosQuestoes) || 0,
          paginasLidas: data.paginasLidas,
          comentarios: data.comentarios,
          userId: userId,
          disciplinaId: data.disciplinaId,
          topicoId: data.topicoId || null,
        },
      });

      // 2. ADEQUAÇÃO: Se um 'revisaoId' foi enviado, marca a revisão como concluída.
      if (data.revisaoId) {
        await tx.revisao.updateMany({
          where: { id: data.revisaoId, userId: userId },
          data: { status: 'CONCLUIDA' },
        });
      }

      // 3. Lógica de concluir tópico e agendar novas revisões (código original mantido)
      if (data.concluiuTopico && data.topicoId) {
        await tx.topico.update({
          where: { id: data.topicoId },
          data: { concluido: true },
        });

        if (data.agendarRevisao) {
          const hoje = new Date();
          const datasRevisao = [addDays(hoje, 1), addDays(hoje, 7), addDays(hoje, 30)];
          await tx.revisao.createMany({
            data: datasRevisao.map(dataAgendada => ({
              dataAgendada,
              topicoId: data.topicoId!,
              userId: userId,
            })),
          });
        }
      }
      
      return novaSessao;
    });
  },

  getAll: async (filters: { disciplinaId?: string; dataInicio?: string; dataFim?: string; }, userId: string) => {
    // ... seu código original aqui, sem alterações ...
    const where: any = { userId };
    if (filters.disciplinaId) { where.disciplinaId = filters.disciplinaId; }
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