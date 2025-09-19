// src/controllers/ciclo.controller.ts
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
    } catch (error) {
      res.status(500).json({ error: 'Falha ao criar ciclo.' });
    }
  },

  getAllByUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const ciclos = await cicloService.getAllByUser(userId);
      res.status(200).json(ciclos);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar ciclos.' });
    }
  },
};