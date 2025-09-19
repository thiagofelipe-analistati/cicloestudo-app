// src/controllers/ciclo.controller.ts
import { Request, Response } from 'express';
import { cicloService } from '../services/ciclo.service';

export const cicloController = {
  create: async (req: Request, res: Response) => { /* ... */ },
  getAllByUser: async (req: Request, res: Response) => { /* ... */ },

  // --- Garanta que esta função está aqui e correta ---
  addItem: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { cicloId } = req.params;
      const { disciplinaId, tempoMinutos } = req.body;
      if (!disciplinaId || !tempoMinutos) {
        return res.status(400).json({ error: 'Disciplina e tempo são obrigatórios.' });
      }
      const item = await cicloService.addItem(cicloId, disciplinaId, Number(tempoMinutos), userId);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ error: 'Falha ao adicionar item ao ciclo.', details: error.message });
    }
  },
  
  removeItem: async (req: Request, res: Response) => { /* ... */ },
};