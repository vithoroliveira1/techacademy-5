import { Router } from 'express';
import authRoutes from './auth.routes';
import marcaRoutes from './marca.routes';
import carroRoutes from './carro.routes';
import vendaRoutes from './venda.routes';
import aluguelRoutes from './aluguel.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/marcas', marcaRoutes);
router.use('/carros', carroRoutes);
router.use('/vendas', vendaRoutes);
router.use('/alugueis', aluguelRoutes);

export default router;
