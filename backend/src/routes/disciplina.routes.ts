import { Router } from 'express';
import { disciplinaController } from '../controllers/disciplina.controller'; // <-- SEM .js

const router = Router();

router.post('/', disciplinaController.create);
router.get('/', disciplinaController.getAll);
// --- NOVAS ROTAS ADICIONADAS ABAIXO ---
// O ':id' é um parâmetro que pegamos na URL

// Rota para Buscar uma disciplina por ID (GET)
router.get('/:id', disciplinaController.getById);

// Rota para Atualizar uma disciplina por ID (PUT)
router.put('/:id', disciplinaController.update);

// Rota para Deletar uma disciplina por ID (DELETE)
router.delete('/:id', disciplinaController.delete);

export default router;