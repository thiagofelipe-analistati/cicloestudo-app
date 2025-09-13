import { Router } from 'express';
import { sessaoController } from '../controllers/sessao.controller';

const router = Router();

router.post('/', sessaoController.create);
router.get('/', sessaoController.getAll);

export default router;