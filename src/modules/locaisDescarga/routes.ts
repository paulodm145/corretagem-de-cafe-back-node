import { Router } from 'express';
import { LocalDescargaController } from './controllers/LocalDescargaController';

const localDescargaRouter = Router();
const localDescargaController = new LocalDescargaController();

localDescargaRouter.get('/locais-descarga', localDescargaController.listar);
localDescargaRouter.get('/locais-descarga/cliente/:clienteId', localDescargaController.listarPorCliente);
localDescargaRouter.get('/locais-descarga/:id', localDescargaController.buscarPorId);
localDescargaRouter.post('/locais-descarga', localDescargaController.criar);
localDescargaRouter.put('/locais-descarga/:id', localDescargaController.atualizar);
localDescargaRouter.delete('/locais-descarga/:id', localDescargaController.remover);

export { localDescargaRouter };
