// src/services/topico.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Tipos para os dados de entrada, para garantir que estamos recebendo o que esperamos
type TopicoCreateData = {
  nome: string;
  urlEstudo?: string;
  comentarios?: string;
};
type TopicoUpdateData = Partial<TopicoCreateData>; // Partial torna todos os campos opcionais

export const topicoService = {
  create: async (data: TopicoCreateData, disciplinaId: string) => {
    return await prisma.topico.create({
      data: {
        ...data,
        disciplina: {
          connect: {
            id: disciplinaId,
          },
        },
      },
    });
  },

  getAllByDisciplinaId: async (disciplinaId: string) => {
    return await prisma.topico.findMany({
      where: {
        disciplinaId: disciplinaId,
      },
    });
  },

  // --- NOVOS MÉTODOS ADICIONADOS ABAIXO ---

  getById: async (id: string) => {
    return await prisma.topico.findUnique({
      where: { id },
    });
  },

  update: async (id: string, data: TopicoUpdateData) => {
    return await prisma.topico.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return await prisma.topico.delete({
      where: { id },
    });
  },
};