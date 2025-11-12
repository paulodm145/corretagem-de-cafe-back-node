import { Router } from 'express';
import { ProdutoController } from './controllers/ProdutoController';

const produtoRouter = Router();
const produtoController = new ProdutoController();

produtoRouter.get('/produtos', produtoController.listar);
produtoRouter.get('/produtos/:id', produtoController.buscarPorId);
produtoRouter.post('/produtos', produtoController.criar);
produtoRouter.put('/produtos/:id', produtoController.atualizar);
produtoRouter.delete('/produtos/:id', produtoController.remover);

export { produtoRouter };
