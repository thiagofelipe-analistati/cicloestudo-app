// src/routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

// Rota para criar um novo usuário
router.post('/register', authController.register);

// Rota para fazer login e obter um token
router.post('/login', authController.login);

export default router;