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
    update: async (cicloId: string, nome: string, userId: string) => {
    return prisma.ciclo.updateMany({
      where: { id: cicloId, userId },
      data: { nome },
    });
  },

  delete: async (cicloId: string, userId: string) => {
    return prisma.ciclo.deleteMany({
      where: { id: cicloId, userId },
    });
  },
    updateOrdemItens: async (cicloId: string, itensOrdenados: { id: string; ordem: number }[], userId: string) => {
    // Garante que o ciclo pertence ao usuário
    const ciclo = await prisma.ciclo.findFirst({ where: { id: cicloId, userId } });
    if (!ciclo) {
      throw new Error("Ciclo não encontrado ou não pertence ao usuário.");
    }

    // Usa uma transação para garantir que todas as atualizações aconteçam ou nenhuma
    const transacao = itensOrdenados.map(item => 
      prisma.cicloItem.update({
        where: { id: item.id },
        data: { ordem: item.ordem },
      })
    );

    return prisma.$transaction(transacao);
  },
  getActiveCicloStatus: async (userId: string) => {
    // 1. Encontra o ciclo marcado como 'ativo' para o usuário
    const cicloAtivo = await prisma.ciclo.findFirst({
      where: { userId, ativo: true },
      include: {
        itens: {
          orderBy: { ordem: 'asc' },
          include: { disciplina: { select: { id: true, nome: true } } },
        },
      },
    });
    
    if (!cicloAtivo || cicloAtivo.itens.length === 0) {
      return null; // Retorna nulo se não houver ciclo ativo ou se ele estiver vazio
    }

    // 2. Cria um mapa para somar o tempo estudado por disciplina
    const tempoEstudadoPorDisciplina = new Map<string, number>();

    // 3. Busca todas as sessões de estudo do usuário e calcula o total por disciplina
    const sessoesDoUsuario = await prisma.sessaoEstudo.findMany({
      where: { userId },
      select: { disciplinaId: true, tempoEstudado: true },
    });

    for (const sessao of sessoesDoUsuario) {
      const tempoAtual = tempoEstudadoPorDisciplina.get(sessao.disciplinaId) || 0;
      tempoEstudadoPorDisciplina.set(sessao.disciplinaId, tempoAtual + sessao.tempoEstudado);
    }

    // 4. Combina os dados: anexa o tempo estudado a cada item do ciclo
    const itensComProgresso = cicloAtivo.itens.map(item => {
      const tempoEstudadoSegundos = tempoEstudadoPorDisciplina.get(item.disciplinaId) || 0;
      return {
        ...item,
        // Adicionamos um novo campo com o tempo já estudado em minutos
        tempoEstudadoMinutos: Math.floor(tempoEstudadoSegundos / 60),
      };
    });

    return { ...cicloAtivo, itens: itensComProgresso };
  },
};