import { Router } from 'express';
import { ObservacaoFiscalController } from './controllers/ObservacaoFiscalController';

const observacaoFiscalRouter = Router();
const observacaoFiscalController = new ObservacaoFiscalController();

observacaoFiscalRouter.get('/observacoes-fiscais', observacaoFiscalController.listar);
observacaoFiscalRouter.get('/observacoes-fiscais/tipo/:tipo', observacaoFiscalController.listarPorTipo);
observacaoFiscalRouter.get('/observacoes-fiscais/:id', observacaoFiscalController.buscarPorId);
observacaoFiscalRouter.post('/observacoes-fiscais', observacaoFiscalController.criar);
observacaoFiscalRouter.put('/observacoes-fiscais/:id', observacaoFiscalController.atualizar);
observacaoFiscalRouter.delete('/observacoes-fiscais/:id', observacaoFiscalController.remover);

export { observacaoFiscalRouter };
