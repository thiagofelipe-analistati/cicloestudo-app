// src/routes/topico.routes.ts
import { Router } from 'express';
import { topicoController } from '../controllers/topico.controller';

const router = Router({ mergeParams: true });

// Rotas que operam na coleção de tópicos (dentro de uma disciplina)
router.post('/', topicoController.create);
router.get('/', topicoController.getAllByDisciplinaId);

// --- NOVAS ROTAS ADICIONADAS ABAIXO ---
// Rotas que operam em um tópico específico, usando :topicoId

router.get('/:topicoId', topicoController.getById);
router.put('/:topicoId', topicoController.update);
router.delete('/:topicoId', topicoController.delete);

export default router;