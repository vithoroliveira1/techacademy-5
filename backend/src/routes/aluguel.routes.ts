import { Router } from 'express';
import { AluguelController } from '../controllers/AluguelController';
import { autenticacao } from '../middlewares/autenticacao';
import { requireRole } from '../middlewares/requireRole';

const router = Router();
const controller = new AluguelController();

// Todas as rotas precisam de autenticação
router.use((req, res, next) => autenticacao(req, res, next));

// Rotas exclusivas de desenvolvedor
router.get('/', requireRole('developer'), controller.listar);
router.delete('/:id', requireRole('developer'), controller.deletar);

// Rotas acessíveis por ambos (lead e developer)
router.get('/meus', controller.listarMeus);
router.get('/:id', controller.obter);
router.post('/', controller.criar);
router.put('/:id/finalizar', controller.finalizar);

export default router;
