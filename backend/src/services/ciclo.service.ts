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
          include: { disciplina: { select: { id: true, nome: true } } },
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
      where: { id: itemId, ciclo: { userId } },
    });
  },

  update: async (cicloId: string, nome: string, userId: string) => {
    return prisma.ciclo.updateMany({
      where: { id: cicloId, userId },
      data: { nome },
    });
  },

  delete: async (cicloId: string, userId: string) => {
    return prisma.ciclo.deleteMany({ where: { id: cicloId, userId } });
  },

  updateOrdemItens: async (cicloId: string, itensOrdenados: { id: string; ordem: number }[], userId: string) => {
    const ciclo = await prisma.ciclo.findFirst({ where: { id: cicloId, userId } });
    if (!ciclo) throw new Error("Ciclo não encontrado ou não pertence ao usuário.");

    const transacao = itensOrdenados.map(item =>
      prisma.cicloItem.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      })
    );

    return prisma.$transaction(transacao);
  },

getAllCiclosComProgresso: async (userId: string) => {
  const ciclos = await prisma.ciclo.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    include: {
      itens: {
        orderBy: { ordem: 'asc' },
        include: { disciplina: { select: { id: true, nome: true } } },
      },
    },
  });

  return Promise.all(ciclos.map(async ciclo => {
    // Pegamos todas as sessões do usuário para as disciplinas do ciclo
    const sessoes = await prisma.sessaoEstudo.findMany({
      where: {
        userId,
        disciplinaId: { in: ciclo.itens.map(i => i.disciplinaId) },
        createdAt: ciclo.ultimaConclusaoEm ? { gt: ciclo.ultimaConclusaoEm } : undefined,
      },
      select: { disciplinaId: true, tempoEstudado: true },
    });

    // Criar um array para armazenar tempo restante por sessão
    const sessoesRestantes = sessoes.map(s => ({ ...s }));

    const itensComProgresso = ciclo.itens.map(item => {
      let tempoAcumulado = 0;
      let restanteItem = item.tempoMinutos * 60; // em segundos

      // Para cada sessão da disciplina, consumir o tempo restante do item
      for (const s of sessoesRestantes.filter(s => s.disciplinaId === item.disciplinaId)) {
        if (restanteItem <= 0) break;
        const usar = Math.min(s.tempoEstudado, restanteItem);
        tempoAcumulado += usar;
        s.tempoEstudado -= usar; // diminuir da sessão para não duplicar em outro item
        restanteItem -= usar;
      }

      return { ...item, tempoEstudadoMinutos: Math.floor(tempoAcumulado / 60) };
    });

    // Atualiza conclusões se necessário
    const totalPlanejado = ciclo.itens.reduce((acc, i) => acc + i.tempoMinutos, 0);
    const totalEstudado = itensComProgresso.reduce(
      (acc, i) => acc + Math.min(i.tempoEstudadoMinutos, i.tempoMinutos),
      0
    );

    let conclusoes = ciclo.conclusoes || 0;
    if (totalPlanejado > 0 && totalEstudado >= totalPlanejado) {
      conclusoes++;
      await prisma.ciclo.update({
        where: { id: ciclo.id },
        data: { conclusoes, ultimaConclusaoEm: new Date() },
      });
    }

    return { ...ciclo, itens: itensComProgresso, conclusoes };
  }));
},
};
