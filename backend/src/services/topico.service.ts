// src/services/topico.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type TopicoCreateData = { nome: string; urlEstudo?: string; comentarios?: string; };
type TopicoUpdateData = Partial<TopicoCreateData>;

export const topicoService = {
  create: async (data: TopicoCreateData, disciplinaId: string, userId: string) => {
    // Verifica se a disciplina pai pertence ao usuário
    const disciplinaPai = await prisma.disciplina.findFirst({ where: { id: disciplinaId, userId }});
    if (!disciplinaPai) {
      throw new Error('Disciplina não encontrada ou não pertence a este usuário.');
    }
    return await prisma.topico.create({
      data: { ...data, disciplinaId, userId },
    });
  },

  getAllByDisciplinaId: async (disciplinaId: string, userId: string) => {
    return await prisma.topico.findMany({ 
      where: { disciplinaId, userId } 
    });
  },

  getById: async (id: string, userId: string) => {
    return await prisma.topico.findFirst({ where: { id, userId } });
  },

  update: async (id: string, data: TopicoUpdateData, userId: string) => {
    await prisma.topico.updateMany({ where: { id, userId }, data });
    return await prisma.topico.findUnique({ where: { id } });
  },

  delete: async (id: string, userId: string) => {
    return await prisma.topico.deleteMany({ where: { id, userId } });
  },
};