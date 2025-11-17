import { AsyncLocalStorage } from 'node:async_hooks';
import type { DataSource } from 'typeorm';
import type { Tenant } from '../modules/tenants/entities/Tenant';

export type TenantStore = { dataSource: DataSource; tenant: Tenant };
const tenantAsyncStorage = new AsyncLocalStorage<TenantStore>();

export const runWithTenant = (store: TenantStore, next: () => void) => {
  tenantAsyncStorage.run(store, next);
};

export const getTenantDS = (): DataSource => {
  const store = tenantAsyncStorage.getStore();
  if (!store) {
    throw new Error('Tenant context not set');
  }
  return store.dataSource;
};

export const getCurrentTenant = (): Tenant => {
  const store = tenantAsyncStorage.getStore();
  if (!store) {
    throw new Error('Tenant context not set');
  }
  return store.tenant;
};
