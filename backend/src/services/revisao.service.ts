// ARQUIVO: backend/src/services/revisao.service.ts
import { startOfDay, endOfDay } from 'date-fns';
import { PrismaClient, StatusRevisao } from '@prisma/client';
const prisma = new PrismaClient();

export const revisaoService = {
  // Busca todas as revisões pendentes para um usuário específico
  getAllPendentes: async (userId: string) => {
    return await prisma.revisao.findMany({
      where: {
        userId: userId,
        status: 'PENDENTE',
      },
      include: {
        topico: {
          select: {
            nome: true,
            disciplina: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataAgendada: 'asc', // Ordena pelas mais próximas primeiro
      },
    });
  },
   getRevisoesDeHoje: async (userId: string) => {
    const hoje = new Date();
    return await prisma.revisao.findMany({
      where: {
        userId: userId,
        status: 'PENDENTE',
        dataAgendada: {
          gte: startOfDay(hoje), // Maior ou igual ao início do dia de hoje
          lte: endOfDay(hoje),   // Menor ou igual ao final do dia de hoje
        },
      },
      include: {
        topico: {
          select: {
            nome: true,
            disciplina: {
              select: {
                nome: true,
              },
            },
          },
        },
      },
      orderBy: {
        dataAgendada: 'asc',
      },
    });
  },

  // Atualiza o status de uma revisão (ex: para CONCLUIDA)
  updateStatus: async (revisaoId: string, userId: string) => {
    // Garante que o usuário só pode atualizar suas próprias revisões
    const revisao = await prisma.revisao.findFirst({
      where: {
        id: revisaoId,
        userId: userId,
      }
    });

    if (!revisao) {
      throw new Error('Revisão não encontrada ou não pertence ao usuário.');
    }

    return await prisma.revisao.update({
      where: {
        id: revisaoId,
      },
      data: {
        status: 'CONCLUIDA',
      },
    });
  },
};