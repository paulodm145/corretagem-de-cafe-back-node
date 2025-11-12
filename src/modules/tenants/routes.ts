import { Router } from 'express';
import { TenantController } from './controllers/TenantController';

const tenantsRouter = Router();
const tenantController = new TenantController();

tenantsRouter.get('/', tenantController.listar);
tenantsRouter.get('/:id', tenantController.buscarPorId);
tenantsRouter.post('/', tenantController.criar);
tenantsRouter.put('/:id', tenantController.atualizar);
tenantsRouter.delete('/:id', tenantController.remover);

export { tenantsRouter };
