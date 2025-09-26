// src/services/sessao.service.ts

import { PrismaClient } from '@prisma/client';
import { addDays } from 'date-fns'; // Precisaremos desta biblioteca para adicionar dias
const prisma = new PrismaClient();

// NOVO: Tipo de dados atualizado para incluir as opções de revisão
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
  concluiuTopico?: boolean; // <-- Novo campo
  agendarRevisao?: boolean; // <-- Novo campo
};

export const sessaoService = {
  create: async (data: SessaoCreateData, userId: string) => {
    // Usamos uma transação para garantir que todas as operações ocorram com sucesso
    return await prisma.$transaction(async (tx) => {
      // 1. Cria a sessão de estudo principal
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

      // 2. Verifica se o tópico foi concluído e se as revisões devem ser agendadas
      if (data.concluiuTopico && data.topicoId) {
        
        // Marca o tópico como concluído
        await tx.topico.update({
          where: { id: data.topicoId },
          data: { concluido: true },
        });

        // Se o usuário também pediu para agendar, cria as revisões
        if (data.agendarRevisao) {
          const hoje = new Date();
          const datasRevisao = [
            addDays(hoje, 1),  // Revisão em 1 dia
            addDays(hoje, 7),  // Revisão em 7 dias
            addDays(hoje, 30), // Revisão em 30 dias
          ];

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