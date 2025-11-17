import { Router } from 'express';
import { UsuarioController } from './controllers/UsuarioController';

const usuarioRouter = Router();
const usuarioController = new UsuarioController();

usuarioRouter.get('/usuarios', usuarioController.listar);
usuarioRouter.get('/usuarios/:id', usuarioController.buscarPorId);
usuarioRouter.post('/usuarios', usuarioController.criar);
usuarioRouter.put('/usuarios/:id', usuarioController.atualizar);
usuarioRouter.delete('/usuarios/:id', usuarioController.remover);

export { usuarioRouter };
