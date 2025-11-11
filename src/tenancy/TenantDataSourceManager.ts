import path from 'node:path';
import { DataSource } from 'typeorm';
import { Tenant } from '../modules/tenants/entities/Tenant';

export const ENTIDADES_TENANT_GLOB = path.join(
  __dirname,
  '..',
  'modules',
  '**',
  'entities',
  '*.{ts,js}'
);
export const MIGRACOES_TENANT_GLOB = path.join(
  __dirname,
  '..',
  'database',
  'migrations',
  '*.{ts,js}'
);

class TenantDataSourceManager {
  private cache = new Map<string, DataSource>(); // key: tenant.token

  async getOrCreate(tenant: Tenant): Promise<DataSource> {
    const cached = this.cache.get(tenant.token);
    if (cached && cached.isInitialized) {
      return cached;
    }

    if (!tenant.dbHost || !tenant.dbUsername || !tenant.dbPassword || !tenant.dbName) {
      throw new Error('Dados de conexão do tenant estão incompletos.');
    }

    const dataSource = new DataSource({
      type: 'postgres',
      host: tenant.dbHost,
      port: tenant.dbPort ?? 5432,
      username: tenant.dbUsername,
      password: tenant.dbPassword,
      database: tenant.dbName,
      ssl: tenant.dbSsl ? { rejectUnauthorized: false } : undefined,
      synchronize: false,
      logging: false,
      entities: [ENTIDADES_TENANT_GLOB],
      migrations: [MIGRACOES_TENANT_GLOB],
    });

    await dataSource.initialize();

    // opcional: garantir migrations aplicadas no banco do tenant
    await dataSource.runMigrations();

    this.cache.set(tenant.token, dataSource);
    return dataSource;
  }

  async closeAll() {
    await Promise.all(
      Array.from(this.cache.values()).map(async (dataSource) => {
        if (dataSource.isInitialized) {
          await dataSource.destroy();
        }
      })
    );
    this.cache.clear();
  }
}

export const tenantDSManager = new TenantDataSourceManager();
