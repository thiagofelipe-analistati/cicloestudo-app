import { Request, Response } from 'express';
import { disciplinaService } from '../services/disciplina.service'; // <-- SEM .js

export const disciplinaController = {
  create: async (req: Request, res: Response) => {
    try {
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ error: 'O nome da disciplina é obrigatório.' });
      }
      const newDisciplina = await disciplinaService.create(nome);
      res.status(201).json(newDisciplina);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao criar disciplina.' });
    }
  },

  getAll: async (req: Request, res: Response) => {
    try {
      const disciplinas = await disciplinaService.getAll();
      res.status(200).json(disciplinas);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar disciplinas.' });
    }
  },
  getById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaService.getById(id);
      if (!disciplina) {
        return res.status(404).json({ error: 'Disciplina não encontrada.' });
      }
      res.status(200).json(disciplina);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao buscar disciplina.' });
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { nome } = req.body;
      if (!nome) {
        return res.status(400).json({ error: 'O nome da disciplina é obrigatório.' });
      }
      const updatedDisciplina = await disciplinaService.update(id, nome);
      res.status(200).json(updatedDisciplina);
    } catch (error) {
      res.status(500).json({ error: 'Falha ao atualizar disciplina.' });
    }
  },

  delete: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await disciplinaService.delete(id);
      res.status(204).send(); // 204 No Content é a resposta padrão para delete com sucesso
    } catch (error) {
      res.status(500).json({ error: 'Falha ao deletar disciplina.' });
    }
  },
  getSummary: async (req: Request, res: Response) => {
    try {
      const summary = await disciplinaService.getSummary();
      res.status(200).json(summary);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Falha ao buscar resumo das disciplinas.' });
    }
  },
};