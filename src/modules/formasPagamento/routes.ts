import { Router } from 'express';
import { FormaPagamentoController } from './controllers/FormaPagamentoController';

const formaPagamentoRouter = Router();
const formaPagamentoController = new FormaPagamentoController();

formaPagamentoRouter.get('/formas-pagamento', formaPagamentoController.listar);
formaPagamentoRouter.get('/formas-pagamento/:id', formaPagamentoController.buscarPorId);
formaPagamentoRouter.post('/formas-pagamento', formaPagamentoController.criar);
formaPagamentoRouter.put('/formas-pagamento/:id', formaPagamentoController.atualizar);
formaPagamentoRouter.delete('/formas-pagamento/:id', formaPagamentoController.remover);

export { formaPagamentoRouter };
