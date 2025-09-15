// src/routes/sessao.routes.ts
import { Router } from 'express';
import { sessaoController } from '../controllers/sessao.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Adiciona o "segurança" a todas as rotas deste arquivo
router.use(authenticateToken);

router.post('/', sessaoController.create);
router.get('/', sessaoController.getAll);

export default router;