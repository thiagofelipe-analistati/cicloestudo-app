// src/routes/disciplina.routes.ts
import { Router } from 'express';
import { disciplinaController } from '../controllers/disciplina.controller';
import topicoRoutes from './topico.routes'; // <-- 1. Importamos as rotas de tópico

const router = Router();

// Rotas que operam em /api/disciplinas
router.post('/', disciplinaController.create);
router.get('/', disciplinaController.getAll);

// Rotas que operam em /api/disciplinas/:id
router.get('/:id', disciplinaController.getById);
router.put('/:id', disciplinaController.update);
router.delete('/:id', disciplinaController.delete);

// --- AQUI ESTÁ A MUDANÇA PRINCIPAL ---
// Dizemos que qualquer rota que chegar em /:disciplinaId/topicos
// deve ser gerenciada pelo roteador 'topicoRoutes'.
router.use('/:disciplinaId/topicos', topicoRoutes); // <-- 2. Usamos o roteador de tópico aqui

export default router;