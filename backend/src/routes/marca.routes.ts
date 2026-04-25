import { Router } from 'express';
import { MarcaController } from '../controllers/MarcaController';
import { autenticacao } from '../middlewares/autenticacao';
import { requireRole } from '../middlewares/requireRole';

const router = Router();
const controller = new MarcaController();

router.use((req, res, next) => autenticacao(req, res, next));

router.get('/', controller.listar);
router.get('/:id', controller.obter);
router.post('/', requireRole('developer'), controller.criar);
router.put('/:id', requireRole('developer'), controller.atualizar);
router.delete('/:id', requireRole('developer'), controller.deletar);

export default router;
