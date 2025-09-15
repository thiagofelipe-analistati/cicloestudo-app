// src/controllers/topico.controller.ts
import { Request, Response } from 'express';
import { topicoService } from '../services/topico.service';

export const topicoController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      
      const { disciplinaId } = req.params;
      const newTopico = await topicoService.create(req.body, disciplinaId, userId);
      res.status(201).json(newTopico);
    } catch (error: any) {
      res.status(500).json({ error: 'Falha ao criar tópico.', details: error.message });
    }
  },

  getAllByDisciplinaId: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      
      const { disciplinaId } = req.params;
      const topicos = await topicoService.getAllByDisciplinaId(disciplinaId, userId);
      res.status(200).json(topicos);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar tópicos.' });
    }
  },

  getById: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { topicoId } = req.params;
      const topico = await topicoService.getById(topicoId, userId);
      if (!topico) return res.status(404).json({ error: 'Tópico não encontrado.' });
      res.status(200).json(topico);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar tópico.' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { topicoId } = req.params;
      const updatedTopico = await topicoService.update(topicoId, req.body, userId);
      res.status(200).json(updatedTopico);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao atualizar tópico.' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Não autorizado.' });
      const { topicoId } = req.params;
      await topicoService.delete(topicoId, userId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Falha ao deletar tópico.' });
    }
  },
};