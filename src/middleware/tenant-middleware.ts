import { NextFunction, Request, Response } from 'express';
import { MasterDataSource } from '../config/master-data-source';
import { Tenant } from '../modules/tenants/entities/Tenant';
import { tenantDSManager } from '../tenancy/TenantDataSourceManager';
import { runWithTenant } from '../tenancy/tenant-context';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = (req.header('x-tenant-token') || '').trim();

    if (!UUID_RE.test(token)) {
      return res.status(400).json({ error: 'x-tenant-token inválido/ausente' });
    }

    const repositorioTenants = MasterDataSource.getRepository(Tenant);
    const tenant = await repositorioTenants.findOne({ where: { token } });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant não encontrado' });
    }

    if (!tenant.isActive) {
      return res.status(403).json({ error: 'Tenant inativo' });
    }

    const dataSource = await tenantDSManager.getOrCreate(tenant);

    runWithTenant({ dataSource, tenant }, () => next());
  } catch (erro: any) {
    console.error('[tenancy] erro:', erro);
    return res.status(500).json({ error: 'Falha ao resolver tenant' });
  }
}
