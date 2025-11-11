import { NextFunction, Request, Response } from 'express';
import { MasterDataSource } from '../config/master-data-source';
import { Tenant } from '../modules/tenants/entities/Tenant';
import { tenantDSManager } from '../tenancy/TenantDataSourceManager';
import { runWithTenant } from '../tenancy/tenant-context';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // pegue o token do header (ou adapte para vir do JWT / sessão)
    const token = (req.header('x-tenant-token') || '').trim();

    if (!UUID_RE.test(token)) {
      return res.status(400).json({ error: 'x-tenant-token inválido/ausente' });
    }

    // busca tenant no banco mestre
    const repo = MasterDataSource.getRepository(Tenant);
    const tenant = await repo.findOne({ where: { token } });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant não encontrado' });
    }

    // cria/pega DataSource do tenant
    const ds = await tenantDSManager.getOrCreate(tenant);

    // inicia contexto da request com o DS do tenant
    runWithTenant({ dataSource: ds, tenant }, () => next());
  } catch (e: any) {
    console.error('[tenancy] erro:', e);
    return res.status(500).json({ error: 'Falha ao resolver tenant' });
  }
}