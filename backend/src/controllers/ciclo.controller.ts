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
    } catch (error) { res.status(500).json({ error: 'Falha ao criar ciclo.' }); }
  },
  getAllByUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const ciclos = await cicloService.getAllByUser(userId);
      res.status(200).json(ciclos);
    } catch (error) { res.status(500).json({ error: 'Falha ao buscar ciclos.' }); }
  },
  addItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      const { disciplinaId, tempoMinutos } = req.body;
      if (!disciplinaId || !tempoMinutos) return res.status(400).json({ error: 'Disciplina e tempo são obrigatórios.' });
      const item = await cicloService.addItem(cicloId, disciplinaId, Number(tempoMinutos), userId);
      res.status(201).json(item);
    } catch (error: any) { res.status(500).json({ error: 'Falha ao adicionar item ao ciclo.' }); }
  },
  removeItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { itemId } = req.params;
      await cicloService.removeItem(itemId, userId);
      res.status(204).send();
    } catch (error) { res.status(500).json({ error: 'Falha ao remover item do ciclo.' }); }
  },
};