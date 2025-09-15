// src/controllers/sessao.controller.ts
import { Request, Response } from 'express';
import { sessaoService } from '../services/sessao.service';

export const sessaoController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      // Passa o userId para o serviço
      const newSessao = await sessaoService.create(req.body, userId);
      res.status(201).json(newSessao);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha ao registrar sessão.' });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      
      const { disciplinaId, dataInicio, dataFim } = req.query;
      const filters = {
        disciplinaId: disciplinaId as string | undefined,
        dataInicio: dataInicio as string | undefined,
        dataFim: dataFim as string | undefined,
      };

      // Passa o userId para o serviço
      const sessoes = await sessaoService.getAll(filters, userId);
      res.status(200).json(sessoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha ao buscar sessões.' });
    }
  },
};