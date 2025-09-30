// ARQUIVO: backend/src/services/revisao.service.ts

import { PrismaClient, StatusRevisao } from '@prisma/client';
const prisma = new PrismaClient();
import { startOfDay } from 'date-fns';

export const revisaoService = {
  getAllPendentes: async (userId: string) => {
    const hoje = startOfDay(new Date());

    const revisoes = await prisma.revisao.findMany({
      where: {
        userId: userId,
        status: 'PENDENTE',
      },
      include: {
        topico: {
          select: {
            id: true,
            nome: true,
            disciplina: {
              select: {
                id: true,
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

    let atrasadasCount = 0;
    let paraHojeCount = 0;

    const revisoesProcessadas = revisoes.map(revisao => {
      const dataRevisao = startOfDay(new Date(revisao.dataAgendada));
      const isAtrasada = dataRevisao < hoje;
      const isParaHoje = dataRevisao.getTime() === hoje.getTime();

      if (isAtrasada) atrasadasCount++;
      if (isParaHoje) paraHojeCount++;

      return {
        ...revisao,
        atrasada: isAtrasada,
      };
    });

    return {
      revisoes: revisoesProcessadas,
      stats: {
        total: revisoes.length,
        atrasadas: atrasadasCount,
        paraHoje: paraHojeCount,
      },
    };
  },

  getRevisoesDeHoje: async (userId: string) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 
    const amanha = new Date(hoje);
    amanha.setDate(hoje.getDate() + 1);

    return await prisma.revisao.findMany({
      where: {
        userId: userId,
        status: 'PENDENTE',
        dataAgendada: {
          gte: hoje,
          lt: amanha,
        },
      },
      include: {
        topico: {
          select: {
            id: true,
            nome: true,
            disciplina: {
              select: {
                id: true,
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

  updateStatus: async (revisaoId: string, userId: string) => {
    const revisao = await prisma.revisao.findFirst({
      where: { id: revisaoId, userId: userId }
    });
    if (!revisao) {
      throw new Error('Revisão não encontrada ou não pertence ao usuário.');
    }
    return await prisma.revisao.update({
      where: { id: revisaoId },
      data: { status: 'CONCLUIDA' },
    });
  },
};