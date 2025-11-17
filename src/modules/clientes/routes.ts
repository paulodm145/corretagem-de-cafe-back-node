import { Router } from 'express';
import { ClienteController } from './controllers/ClienteController';

const clienteRouter = Router();
const clienteController = new ClienteController();

clienteRouter.get('/clientes', clienteController.listar);
clienteRouter.get('/clientes/:id', clienteController.buscarPorId);
clienteRouter.post('/clientes', clienteController.criar);
clienteRouter.put('/clientes/:id', clienteController.atualizar);
clienteRouter.delete('/clientes/:id', clienteController.remover);

export { clienteRouter };
