import { NextFunction, Request, Response } from 'express';
import { runWithTenant } from '../tenancy/tenant-context';
import { carregarContextoTenant, TenantTokenError } from '../tenancy/tenant-token-resolver';

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.header('x-tenant-token') || '').trim();
    const contexto = await carregarContextoTenant(token);
    runWithTenant(contexto, () => next());
  } catch (erro: any) {
    if (erro instanceof TenantTokenError) {
      const mensagemErro = erro.statusCode === 400 ? 'x-tenant-token inválido/ausente' : erro.message;
      return res.status(erro.statusCode).json({ error: mensagemErro });
    }
    console.error('[tenancy] erro:', erro);
    return res.status(500).json({ error: 'Falha ao resolver tenant' });
  }
}
