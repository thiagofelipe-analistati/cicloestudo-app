// src/services/ciclo.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cicloService = {
  // Criar um novo ciclo de estudos
  create: async (nome: string, userId: string) => {
    return prisma.ciclo.create({
      data: {
        nome,
        userId,
      },
    });
  },

  // Listar todos os ciclos de um usuário
  getAllByUser: async (userId: string) => {
    return prisma.ciclo.findMany({
      where: { userId },
      include: {
        // Inclui os itens de cada ciclo, ordenados pela posição
        itens: {
          orderBy: {
            ordem: 'asc',
          },
          include: {
            disciplina: true, // Inclui o nome da disciplina em cada item
          }
        },
      },
    });
  },

  // (No futuro, adicionaremos aqui as funções de update, delete, addItem, etc.)
};