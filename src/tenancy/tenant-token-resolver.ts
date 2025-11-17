import { MasterDataSource } from '../config/master-data-source';
import { Tenant } from '../modules/tenants/entities/Tenant';
import { tenantDSManager } from './TenantDataSourceManager';
import { runWithTenant, TenantStore } from './tenant-context';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class TenantTokenError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'TenantTokenError';
  }
}

async function carregarContextoTenant(tokenInformado: string): Promise<TenantStore> {
  const token = tokenInformado.trim();

  if (!token) {
    throw new TenantTokenError(400, 'Token do tenant é obrigatório.');
  }

  if (!UUID_RE.test(token)) {
    throw new TenantTokenError(400, 'Token do tenant inválido.');
  }

  const repositorioTenants = MasterDataSource.getRepository(Tenant);
  const tenant = await repositorioTenants.findOne({ where: { token } });

  if (!tenant) {
    throw new TenantTokenError(404, 'Tenant não encontrado.');
  }

  if (!tenant.isActive) {
    throw new TenantTokenError(403, 'Tenant inativo.');
  }

  const dataSource = await tenantDSManager.getOrCreate(tenant);
  return { tenant, dataSource };
}

export async function executarNoTenantPorToken<T>(
  token: string,
  callback: () => Promise<T>
): Promise<T> {
  const contexto = await carregarContextoTenant(token);

  return new Promise<T>((resolve, reject) => {
    runWithTenant(contexto, () => {
      callback().then(resolve).catch(reject);
    });
  });
}

export { carregarContextoTenant };
