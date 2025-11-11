import path from 'node:path';
import { DataSource } from 'typeorm';
import { Tenant } from '../modules/tenants/entities/Tenant';

const ENTITIES_GLOB = path.join(__dirname, '..', 'modules', '**', 'entities', '*.{ts,js}');
const MIGRATIONS_GLOB = path.join(__dirname, '..', 'database', 'migrations', '*.{ts,js}');

class TenantDataSourceManager {
  private cache = new Map<string, DataSource>(); // key: tenant.token

  async getOrCreate(tenant: Tenant): Promise<DataSource> {
    const cached = this.cache.get(tenant.token);
    if (cached && cached.isInitialized) return cached;

    const ds = new DataSource({
      type: 'postgres',
      host: tenant.dbHost,
      port: tenant.dbPort,
      username: tenant.dbUsername,
      password: tenant.dbPassword,
      database: tenant.dbName,
      ssl: tenant.dbSsl ? { rejectUnauthorized: false } : undefined,
      synchronize: false,
      logging: false,
      entities: [ENTITIES_GLOB],
      migrations: [MIGRATIONS_GLOB],
    });

    await ds.initialize();

    // opcional: garantir migrations aplicadas no banco do tenant
    await ds.runMigrations();

    this.cache.set(tenant.token, ds);
    return ds;
  }

  async closeAll() {
    await Promise.all(
      Array.from(this.cache.values()).map(async (ds) => ds.isInitialized && ds.destroy())
    );
    this.cache.clear();
  }
}

export const tenantDSManager = new TenantDataSourceManager();