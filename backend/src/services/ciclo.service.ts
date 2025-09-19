import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const cicloService = {
  create: async (nome: string, userId: string) => {
    return prisma.ciclo.create({ data: { nome, userId } });
  },
  getAllByUser: async (userId: string) => {
    return prisma.ciclo.findMany({
      where: { userId },
      include: {
        itens: {
          orderBy: { ordem: 'asc' },
          include: {
            disciplina: { select: { id: true, nome: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  },
  addItem: async (cicloId: string, disciplinaId: string, tempoMinutos: number, userId: string) => {
    const ciclo = await prisma.ciclo.findFirst({ where: { id: cicloId, userId } });
    if (!ciclo) throw new Error("Ciclo não encontrado.");

    const ultimoItem = await prisma.cicloItem.findFirst({ where: { cicloId }, orderBy: { ordem: 'desc' } });
    const novaOrdem = (ultimoItem?.ordem || 0) + 1;

    return prisma.cicloItem.create({
      data: { cicloId, disciplinaId, tempoMinutos, ordem: novaOrdem, userId },
    });
  },
  removeItem: async (itemId: string, userId: string) => {
    return prisma.cicloItem.deleteMany({
      where: { id: itemId, ciclo: { userId: userId } },
    });
  },
};