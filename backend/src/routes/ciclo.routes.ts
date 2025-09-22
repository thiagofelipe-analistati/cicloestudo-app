// src/routes/ciclo.routes.ts
import { Router } from 'express';
import { cicloController } from '../controllers/ciclo.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticateToken);

// Rotas para a coleção de ciclos
router.post('/', cicloController.create);
router.get('/', cicloController.getAllByUser);

// --- Garanta que estas rotas para os itens estão aqui ---
router.post('/:cicloId/items', cicloController.addItem);
router.delete('/items/:itemId', cicloController.removeItem);
// Rotas que operam em um ciclo específico
router.put('/:cicloId', cicloController.update);
router.delete('/:cicloId', cicloController.delete);

// Rotas para os itens
router.post('/:cicloId/items', cicloController.addItem);
router.delete('/items/:itemId', cicloController.removeItem);
router.patch('/:cicloId/items/reorder', cicloController.updateOrdemItens); 

// --- NOVA ROTA ADICIONADA ---
// Rota para buscar o status do ciclo ativo para o dashboard

router.get('/progresso-all', cicloController.getAllCiclosComProgresso);
export default router;