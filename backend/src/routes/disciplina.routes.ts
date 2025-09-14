// src/routes/disciplina.routes.ts
import { Router } from 'express';
import { disciplinaController } from '../controllers/disciplina.controller';
import topicoRoutes from './topico.routes';

const router = Router();

router.post('/', disciplinaController.create);
router.get('/', disciplinaController.getAll);

// ROTA ESPECÍFICA (ESTÁTICA) VEM PRIMEIRO
router.get('/summary', disciplinaController.getSummary);

// ROTAS DINÂMICAS (COM PARÂMETROS) VÊM DEPOIS
router.get('/:id', disciplinaController.getById);
router.put('/:id', disciplinaController.update);
router.delete('/:id', disciplinaController.delete);

// ROTA ANINHADA
router.use('/:disciplinaId/topicos', topicoRoutes);

export default router;