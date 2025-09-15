// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }

      await authService.register(email, password);
      
      res.status(201).json({ message: 'Usuário criado com sucesso.' });
    } catch (error: any) {
      // Verifica se o erro é de e-mail já existente
      if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
        return res.status(409).json({ error: 'Este email já está em uso.' });
      }
      console.error(error); // Loga o erro real no servidor
      res.status(500).json({ error: 'Falha ao registrar usuário.' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
      }
      const result = await authService.login(email, password);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: 'Email ou senha inválidos.' });
    }
  },
};