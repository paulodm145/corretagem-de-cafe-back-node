import 'reflect-metadata';
import express, { Router, Request, Response, NextFunction } from 'express';
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
import { observacaoFiscalRouter } from './modules/observacoesFiscais/routes';

config();

const app = express();
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/tenants', tenantsRouter);
app.use('/auth', authRouter);

const rotasTenant = Router();
rotasTenant.use(tenantMiddleware);

const rotasProtegidas = Router();
rotasProtegidas.use(authMiddleware);
rotasProtegidas.use(estadoRouter);
rotasProtegidas.use(cidadeRouter);
rotasProtegidas.use(produtoRouter);
rotasProtegidas.use(usuarioRouter);
rotasProtegidas.use(tipoSacariaRouter);
rotasProtegidas.use(observacaoFiscalRouter);

rotasTenant.use(rotasProtegidas);

const rotasPublicas = ['/auth', '/tenants', '/health'];

app.use((req: Request, res: Response, next: NextFunction) => {
  const caminho = req.path;
  const rotaEhPublica = rotasPublicas.some((rota) => caminho.startsWith(rota));

  if (rotaEhPublica) {
    return next();
  }

  return rotasTenant(req, res, next);
});

export { app };
