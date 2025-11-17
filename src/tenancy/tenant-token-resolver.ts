import { MasterDataSource } from '../config/master-data-source';
import { Tenant } from '../modules/tenants/entities/Tenant';
import { tenantDSManager } from './TenantDataSourceManager';
import { runWithTenant, TenantStore } from './tenant-context';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizarCnpj(valor: string): string {
  return valor.replace(/\D/g, '');
}

export class TenantResolverError extends Error {
  constructor(public readonly statusCode: number, message: string) {
    super(message);
    this.name = 'TenantResolverError';
  }
}

async function carregarContextoTenantPorToken(tokenInformado: string): Promise<TenantStore> {
  const token = tokenInformado.trim();

  if (!token) {
    throw new TenantResolverError(400, 'Token do tenant é obrigatório.');
  }

  if (!UUID_RE.test(token)) {
    throw new TenantResolverError(400, 'Token do tenant inválido.');
  }

  const repositorioTenants = MasterDataSource.getRepository(Tenant);
  const tenant = await repositorioTenants.findOne({ where: { token } });

  if (!tenant) {
    throw new TenantResolverError(404, 'Tenant não encontrado.');
  }

  if (!tenant.isActive) {
    throw new TenantResolverError(403, 'Tenant inativo.');
  }

  const dataSource = await tenantDSManager.getOrCreate(tenant);
  return { tenant, dataSource };
}

async function carregarContextoTenantPorCnpj(cnpjInformado: string): Promise<TenantStore> {
  const cnpj = normalizarCnpj(cnpjInformado);

  if (!cnpj) {
    throw new TenantResolverError(400, 'CNPJ é obrigatório para autenticação.');
  }

  if (cnpj.length !== 14) {
    throw new TenantResolverError(400, 'CNPJ inválido para autenticação.');
  }

  const repositorioTenants = MasterDataSource.getRepository(Tenant);
  const tenant = await repositorioTenants.findOne({ where: { cnpj } });

  if (!tenant) {
    throw new TenantResolverError(404, 'Tenant não encontrado para o CNPJ informado.');
  }

  if (!tenant.isActive) {
    throw new TenantResolverError(403, 'Tenant inativo.');
  }

  const dataSource = await tenantDSManager.getOrCreate(tenant);
  return { tenant, dataSource };
}

async function executarNoTenant<T>(
  carregador: (identificador: string) => Promise<TenantStore>,
  identificador: string,
  callback: () => Promise<T>
): Promise<T> {
  const contexto = await carregador(identificador);

  return new Promise<T>((resolve, reject) => {
    runWithTenant(contexto, () => {
      callback().then(resolve).catch(reject);
    });
  });
}

export function executarNoTenantPorToken<T>(token: string, callback: () => Promise<T>): Promise<T> {
  return executarNoTenant(carregarContextoTenantPorToken, token, callback);
}

export function executarNoTenantPorCnpj<T>(cnpj: string, callback: () => Promise<T>): Promise<T> {
  return executarNoTenant(carregarContextoTenantPorCnpj, cnpj, callback);
}

export { carregarContextoTenantPorToken as carregarContextoTenant, TenantStore };
