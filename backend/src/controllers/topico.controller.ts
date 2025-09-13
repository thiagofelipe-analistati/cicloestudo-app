// src/controllers/topico.controller.ts
import { Request, Response } from 'express';
import { topicoService } from '../services/topico.service';

export const topicoController = {
  create: async (req: Request, res: Response) => {
    try {
      const { disciplinaId } = req.params;
      const topicoData = req.body;

      const newTopico = await topicoService.create(topicoData, disciplinaId);
      res.status(201).json(newTopico);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao criar tópico.' });
    }
  },

  getAllByDisciplinaId: async (req: Request, res: Response) => {
    try {
      const { disciplinaId } = req.params;
      const topicos = await topicoService.getAllByDisciplinaId(disciplinaId);
      res.status(200).json(topicos);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar tópicos.' });
    }
  },

  // --- NOVOS MÉTODOS ADICIONADOS ABAIXO ---

  getById: async (req: Request, res: Response) => {
    try {
      const { topicoId } = req.params;
      const topico = await topicoService.getById(topicoId);
      if (!topico) {
        return res.status(404).json({ error: 'Tópico não encontrado.' });
      }
      res.status(200).json(topico);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar tópico.' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { topicoId } = req.params;
      const topicoData = req.body;
      const updatedTopico = await topicoService.update(topicoId, topicoData);
      res.status(200).json(updatedTopico);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao atualizar tópico.' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { topicoId } = req.params;
      await topicoService.delete(topicoId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Falha ao deletar tópico.' });
    }
  },
};