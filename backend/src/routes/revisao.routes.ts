// ARQUIVO: backend/src/routes/revisao.routes.ts

import { Router } from 'express';
import { revisaoController } from '../controllers/revisao.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Protege todas as rotas de revisão com autenticação
router.use(authenticateToken);

// Rota para buscar todas as revisões pendentes
router.get('/', revisaoController.getAllPendentes);

// Rota para marcar uma revisão como concluída
router.patch('/:revisaoId/concluir', revisaoController.updateStatus);

export default router;