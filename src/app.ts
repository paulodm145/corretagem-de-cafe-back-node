import 'reflect-metadata';
import express from 'express';
import { config } from 'dotenv';
import { estadoRouter } from './modules/estados/routes';
import { cidadeRouter } from './modules/cidades/routes';
import { tenantMiddleware } from './middleware/tenant-middleware';

config();

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/', estadoRouter);
app.use('/', cidadeRouter);

// Rotas dos tenants

export { app };