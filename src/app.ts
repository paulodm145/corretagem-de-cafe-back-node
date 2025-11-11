import 'reflect-metadata';
import express, { Router, Request, Response } from 'express';
import { config } from 'dotenv';
import { estadoRouter } from './modules/estados/routes';
import { cidadeRouter } from './modules/cidades/routes';
import { tenantMiddleware } from './middleware/tenant-middleware';
import { tenantsRouter } from './modules/tenants/routes';

config();

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/tenants', tenantsRouter);

const rotasTenant = Router();
rotasTenant.use(estadoRouter);
rotasTenant.use(cidadeRouter);

app.use(tenantMiddleware, rotasTenant);

export { app };
