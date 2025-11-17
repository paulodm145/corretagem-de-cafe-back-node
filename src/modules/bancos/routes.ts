import { Router } from 'express';
import { BancoController } from './controllers/BancoController';

const bancoController = new BancoController();
const bancoRouter = Router();

bancoRouter.get('/bancos', bancoController.listar);
bancoRouter.get('/bancos/:id', bancoController.buscarPorId);
bancoRouter.post('/bancos', bancoController.criar);
bancoRouter.put('/bancos/:id', bancoController.atualizar);
bancoRouter.delete('/bancos/:id', bancoController.remover);

export { bancoRouter };
