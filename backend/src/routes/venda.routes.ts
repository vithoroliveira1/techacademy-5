import { Router } from 'express';
import { VendaController } from '../controllers/VendaController';
import { autenticacao } from '../middlewares/autenticacao';
import { requireRole } from '../middlewares/requireRole';

const router = Router();
const controller = new VendaController();

router.use((req, res, next) => autenticacao(req, res, next));
router.use(requireRole('developer')); // Vendas só fazem sentido para developer

router.get('/', controller.listar);
router.get('/:id', controller.obter);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export default router;
