import { Router } from 'express';
import { ContaBancariaController } from './controllers/ContaBancariaController';

const contaBancariaRouter = Router();
const contaBancariaController = new ContaBancariaController();

contaBancariaRouter.get('/contas-bancarias', contaBancariaController.listar);
contaBancariaRouter.get('/contas-bancarias/cliente/:clienteId', contaBancariaController.listarPorCliente);
contaBancariaRouter.get('/contas-bancarias/:id', contaBancariaController.buscarPorId);
contaBancariaRouter.post('/contas-bancarias', contaBancariaController.criar);
contaBancariaRouter.put('/contas-bancarias/:id', contaBancariaController.atualizar);
contaBancariaRouter.delete('/contas-bancarias/:id', contaBancariaController.remover);

export { contaBancariaRouter };
