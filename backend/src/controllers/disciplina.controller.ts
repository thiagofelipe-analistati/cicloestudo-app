// src/controllers/disciplina.controller.ts
import { Request, Response } from 'express';
import { disciplinaService } from '../services/disciplina.service';

export const disciplinaController = {
  create: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'O nome da disciplina é obrigatório.' });
      const newDisciplina = await disciplinaService.create(nome, userId);
      res.status(201).json(newDisciplina);
    } catch (error) { res.status(500).json({ error: 'Falha ao criar disciplina.' }); }
  },
  getAll: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const disciplinas = await disciplinaService.getAll(userId);
      res.status(200).json(disciplinas);
    } catch (error) { res.status(500).json({ error: 'Falha ao buscar disciplinas.' }); }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const { id } = req.params;
      const disciplina = await disciplinaService.getById(id, userId);
      if (!disciplina) return res.status(404).json({ error: 'Disciplina não encontrada.' });
      res.status(200).json(disciplina);
    } catch (error) { res.status(500).json({ error: 'Falha ao buscar disciplina.' }); }
  },
  update: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const { id } = req.params;
      const { nome } = req.body;
      if (!nome) return res.status(400).json({ error: 'O nome é obrigatório.' });
      const updatedDisciplina = await disciplinaService.update(id, nome, userId);
      res.status(200).json(updatedDisciplina);
    } catch (error) { res.status(500).json({ error: 'Falha ao atualizar disciplina.' }); }
  },
  delete: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const { id } = req.params;
      await disciplinaService.delete(id, userId);
      res.status(204).send();
    } catch (error) { res.status(500).json({ error: 'Falha ao deletar disciplina.' }); }
  },
  getSummary: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Usuário não autenticado.' });
      const summary = await disciplinaService.getSummary(userId);
      res.status(200).json(summary);
    } catch (error) { res.status(500).json({ error: 'Falha ao buscar resumo.' }); }
  },
};