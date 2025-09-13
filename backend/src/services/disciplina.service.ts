// src/services/disciplina.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const disciplinaService = {
  // Criar uma nova disciplina
  create: async (nome: string) => {
    return await prisma.disciplina.create({
      data: { nome },
    });
  },

  // Listar todas as disciplinas
  getAll: async () => {
    return await prisma.disciplina.findMany();
  },

  // Encontrar uma disciplina pelo ID
  getById: async (id: string) => {
    return await prisma.disciplina.findUnique({
      where: { id },
    });
  },

  // Atualizar uma disciplina
  update: async (id: string, nome: string) => {
    return await prisma.disciplina.update({
      where: { id },
      data: { nome },
    });
  },

  // Deletar uma disciplina
  delete: async (id: string) => {
    return await prisma.disciplina.delete({
      where: { id },
    });
  },
};