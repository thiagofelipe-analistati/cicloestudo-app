// src/services/disciplina.service.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const disciplinaService = {
  create: async (nome: string) => {
    return await prisma.disciplina.create({ data: { nome } });
  },
  getAll: async () => {
    return await prisma.disciplina.findMany({ orderBy: { nome: 'asc' } });
  },
  getById: async (id: string) => {
    return await prisma.disciplina.findUnique({ where: { id } });
  },
  update: async (id: string, nome: string) => {
    return await prisma.disciplina.update({ where: { id }, data: { nome } });
  },
  delete: async (id: string) => {
    return await prisma.disciplina.delete({ where: { id } });
  },
  getSummary: async () => {
    const todasDisciplinas = await prisma.disciplina.findMany({
      select: { id: true, nome: true },
      orderBy: { nome: 'asc' },
    });
    const agregados = await prisma.sessaoEstudo.groupBy({
      by: ['disciplinaId'],
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