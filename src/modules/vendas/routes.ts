import { Router } from 'express';
import { VendaController } from './controllers/VendaController';

const vendaRouter = Router();
const vendaController = new VendaController();

vendaRouter.get('/vendas', vendaController.listar);

export { vendaRouter };
