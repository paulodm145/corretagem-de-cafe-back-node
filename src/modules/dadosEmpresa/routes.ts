import { Router } from 'express';
import { DadosEmpresaController } from './controllers/DadosEmpresaController';

const dadosEmpresaRouter = Router();
const dadosEmpresaController = new DadosEmpresaController();

dadosEmpresaRouter.get('/dados-empresa', dadosEmpresaController.obter);
dadosEmpresaRouter.put('/dados-empresa', dadosEmpresaController.atualizar);

export { dadosEmpresaRouter };
