// src/routes/ciclo.routes.ts
import { Router } from 'express';
import { cicloController } from '../controllers/ciclo.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken); // Protege todas as rotas de ciclo

router.post('/', cicloController.create);
router.get('/', cicloController.getAllByUser);

export default router;