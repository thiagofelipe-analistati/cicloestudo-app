import { Request, Response } from 'express';
import { cicloService } from '../services/ciclo.service';

export const cicloController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'O nome do ciclo é obrigatório.' });
      const ciclo = await cicloService.create(nome, userId);
      res.status(201).json(ciclo);
    } catch {
      res.status(500).json({ error: 'Falha ao criar ciclo.' });
    }
  },

  getAllByUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const ciclos = await cicloService.getAllByUser(userId);
      res.status(200).json(ciclos);
    } catch {
      res.status(500).json({ error: 'Falha ao buscar ciclos.' });
    }
  },

  addItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      const { disciplinaId, tempoMinutos } = req.body;
      if (!disciplinaId || !tempoMinutos)
        return res.status(400).json({ error: 'Disciplina e tempo são obrigatórios.' });
      const item = await cicloService.addItem(cicloId, disciplinaId, Number(tempoMinutos), userId);
      res.status(201).json(item);
    } catch {
      res.status(500).json({ error: 'Falha ao adicionar item ao ciclo.' });
    }
  },

  removeItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { itemId } = req.params;
      await cicloService.removeItem(itemId, userId);
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Falha ao remover item do ciclo.' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'O nome é obrigatório.' });
      await cicloService.update(cicloId, nome, userId);
      res.status(200).json({ message: 'Ciclo atualizado com sucesso.' });
    } catch {
      res.status(500).json({ error: 'Falha ao atualizar ciclo.' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      await cicloService.delete(cicloId, userId);
      res.status(204).send();
    } catch {
      res.status(500).json({ error: 'Falha ao deletar ciclo.' });
    }
  },

  updateOrdemItens: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      const { itens } = req.body;
      await cicloService.updateOrdemItens(cicloId, itens, userId);
      res.status(200).json({ message: 'Ordem atualizada com sucesso.' });
    } catch (error: any) {
      res.status(500).json({ error: 'Falha ao reordenar itens.', details: error.message });
    }
  },

  getAllCiclosComProgresso: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const ciclosComProgresso = await cicloService.getAllCiclosComProgresso(userId);
      res.status(200).json(ciclosComProgresso);
    } catch {
      res.status(500).json({ error: 'Falha ao buscar progresso dos ciclos.' });
    }
  },
};
