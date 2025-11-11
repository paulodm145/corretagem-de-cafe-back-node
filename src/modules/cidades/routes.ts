import { Router } from 'express';
import { CidadeController } from './controller/CidadeController';

const cidadeRouter = Router();

cidadeRouter.get('/cidades/:uf', CidadeController.findByUf);

export { cidadeRouter };

