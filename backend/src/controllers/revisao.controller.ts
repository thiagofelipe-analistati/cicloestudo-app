// ARQUIVO: backend/src/controllers/revisao.controller.ts

import { Request, Response } from 'express';
import { revisaoService } from '../services/revisao.service';

export const revisaoController = {
  getAllPendentes: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const revisoes = await revisaoService.getAllPendentes(userId);
      res.status(200).json(revisoes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha ao buscar revisões.' });
    }
  },

  updateStatus: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });

      const { revisaoId } = req.params;
      const revisaoAtualizada = await revisaoService.updateStatus(revisaoId, userId);
      res.status(200).json(revisaoAtualizada);
    } catch (error: any) {
      console.error(error);
      const status = error.message.includes('não encontrada') ? 404 : 500;
      res.status(status).json({ error: error.message || 'Falha ao atualizar revisão.' });
    }
  },
};