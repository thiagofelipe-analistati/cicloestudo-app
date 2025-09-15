// src/services/disciplina.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const disciplinaService = {
  create: async (nome: string, userId: string) => {
    return await prisma.disciplina.create({ data: { nome, userId } });
  },
  getAll: async (userId: string) => {
    return await prisma.disciplina.findMany({ where: { userId }, orderBy: { nome: 'asc' } });
  },
  getById: async (id: string, userId: string) => {
    return await prisma.disciplina.findFirst({ where: { id, userId } });
  },
  update: async (id: string, nome: string, userId: string) => {
    await prisma.disciplina.updateMany({ where: { id, userId }, data: { nome } });
    return await prisma.disciplina.findUnique({ where: { id } });
  },
  delete: async (id: string, userId: string) => {
    return await prisma.disciplina.deleteMany({ where: { id, userId } });
  },
  getSummary: async (userId: string) => {
    const todasDisciplinas = await prisma.disciplina.findMany({
      where: { userId }, select: { id: true, nome: true }, orderBy: { nome: 'asc' },
    });
    const agregados = await prisma.sessaoEstudo.groupBy({
      by: ['disciplinaId'], where: { userId },
      _sum: { tempoEstudado: true, totalQuestoes: true, acertosQuestoes: true },
    });
    const summary = todasDisciplinas.map(disciplina => {
      const dadosAgregados = agregados.find(agg => agg.disciplinaId === disciplina.id);
      return {
        id: disciplina.id,
        nome: disciplina.nome,
        tempoTotal: dadosAgregados?._sum.tempoEstudado || 0,
        questoesTotal: dadosAgregados?._sum.totalQuestoes || 0,
        acertosTotal: dadosAgregados?._sum.acertosQuestoes || 0,
      };
    });
    return summary;
  },
};