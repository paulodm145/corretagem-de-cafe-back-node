import { Router } from 'express';
import { EstadoController } from './controllers/EstadoController';

const estadoRouter = Router();
estadoRouter.get('/estados', EstadoController.findAll);

export  { estadoRouter };
