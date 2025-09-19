// src/services/ciclo.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cicloService = {
  create: async (nome: string, userId: string) => { /* ... */ },
  getAllByUser: async (userId: string) => { /* ... */ },

  // --- Garanta que esta função está aqui e correta ---
  addItem: async (cicloId: string, disciplinaId: string, tempoMinutos: number, userId: string) => {
    const ciclo = await prisma.ciclo.findFirst({ where: { id: cicloId, userId } });
    if (!ciclo) {
      throw new Error("Ciclo não encontrado ou não pertence ao usuário.");
    }
    const ultimoItem = await prisma.cicloItem.findFirst({
      where: { cicloId },
      orderBy: { ordem: 'desc' },
    });
    const novaOrdem = (ultimoItem?.ordem || 0) + 1;
    return prisma.cicloItem.create({
      data: { cicloId, disciplinaId, tempoMinutos, ordem: novaOrdem, userId: userId, },
    });
  },
  
  removeItem: async (itemId: string, userId: string) => { /* ... */ },
};