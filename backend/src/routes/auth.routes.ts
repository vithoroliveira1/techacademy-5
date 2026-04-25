import { Router, RequestHandler } from 'express';
import { AuthController } from '../controllers/AuthController';
import { autenticacao } from '../middlewares/autenticacao';

const router = Router();
const controller = new AuthController();

router.post('/registrar', controller.registrar);
router.post('/login', controller.login);
router.get('/perfil', autenticacao as RequestHandler, controller.perfil);
router.put('/perfil/:id', autenticacao as RequestHandler, controller.atualizar);

export default router;
