import { Router } from 'express';
import { CarroController } from '../controllers/CarroController';
import { autenticacao } from '../middlewares/autenticacao';
import { requireRole } from '../middlewares/requireRole';

const router = Router();
const controller = new CarroController();

router.use((req, res, next) => autenticacao(req, res, next));

// Rotas acessíveis por todos
router.get('/disponiveis', controller.listarDisponiveis);
router.get('/:id', controller.obter);

// Rotas exclusivas de desenvolvedor
router.get('/', requireRole('developer'), controller.listar);
router.post('/', requireRole('developer'), controller.criar);
router.put('/:id', requireRole('developer'), controller.atualizar);
router.delete('/:id', requireRole('developer'), controller.deletar);

export default router;
