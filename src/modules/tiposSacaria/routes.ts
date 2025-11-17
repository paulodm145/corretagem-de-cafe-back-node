import { Router } from 'express';
import { TipoSacariaController } from './controllers/TipoSacariaController';

const tipoSacariaRouter = Router();
const tipoSacariaController = new TipoSacariaController();

tipoSacariaRouter.get('/tipos-sacaria', tipoSacariaController.listar);
tipoSacariaRouter.get('/tipos-sacaria/:id', tipoSacariaController.buscarPorId);
tipoSacariaRouter.post('/tipos-sacaria', tipoSacariaController.criar);
tipoSacariaRouter.put('/tipos-sacaria/:id', tipoSacariaController.atualizar);
tipoSacariaRouter.delete('/tipos-sacaria/:id', tipoSacariaController.remover);

export { tipoSacariaRouter };
