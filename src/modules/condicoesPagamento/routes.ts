import { Router } from 'express';
import { CondicaoPagamentoController } from './controllers/CondicaoPagamentoController';

const condicaoPagamentoRouter = Router();
const condicaoPagamentoController = new CondicaoPagamentoController();

condicaoPagamentoRouter.get('/condicoes-pagamento', condicaoPagamentoController.listar);
condicaoPagamentoRouter.get('/condicoes-pagamento/:id', condicaoPagamentoController.buscarPorId);
condicaoPagamentoRouter.get(
  '/condicoes-pagamento/forma/:formaPagamentoId',
  condicaoPagamentoController.listarPorFormaPagamento,
);
condicaoPagamentoRouter.post('/condicoes-pagamento', condicaoPagamentoController.criar);
condicaoPagamentoRouter.put('/condicoes-pagamento/:id', condicaoPagamentoController.atualizar);
condicaoPagamentoRouter.delete('/condicoes-pagamento/:id', condicaoPagamentoController.remover);

export { condicaoPagamentoRouter };
