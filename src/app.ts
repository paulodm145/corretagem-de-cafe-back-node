import 'reflect-metadata';
import express, { Router, Request, Response } from 'express';
import { config } from 'dotenv';
import { estadoRouter } from './modules/estados/routes';
import { cidadeRouter } from './modules/cidades/routes';
import { tenantMiddleware } from './middleware/tenant-middleware';
import { tenantsRouter } from './modules/tenants/routes';
import { produtoRouter } from './modules/produtos/routes';
import { usuarioRouter } from './modules/usuarios/routes';
import { authRouter } from './modules/autenticacao/routes';
import { authMiddleware } from './middleware/auth-middleware';
import { tipoSacariaRouter } from './modules/tiposSacaria/routes';

config();

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/tenants', tenantsRouter);

const rotasTenant = Router();
rotasTenant.use(tenantMiddleware);
rotasTenant.use('/auth', authRouter);

const rotasProtegidas = Router();
rotasProtegidas.use(authMiddleware);
rotasProtegidas.use(estadoRouter);
rotasProtegidas.use(cidadeRouter);
rotasProtegidas.use(produtoRouter);
rotasProtegidas.use(usuarioRouter);
rotasProtegidas.use(tipoSacariaRouter);

rotasTenant.use(rotasProtegidas);

app.use(rotasTenant);

export { app };
