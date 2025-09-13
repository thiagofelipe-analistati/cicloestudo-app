import { Request, Response } from 'express';
import { sessaoService } from '../services/sessao.service';

export const sessaoController = {
  create: async (req: Request, res: Response) => {
    try {
      const newSessao = await sessaoService.create(req.body);
      res.status(201).json(newSessao);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao registrar sessão.' });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const sessoes = await sessaoService.getAll();
      res.status(200).json(sessoes);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar sessões.' });
    }
  },
};