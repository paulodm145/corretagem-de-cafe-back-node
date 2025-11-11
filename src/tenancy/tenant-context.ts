import { AsyncLocalStorage } from 'node:async_hooks';
import type { DataSource } from 'typeorm';
import type { Tenant } from '../modules/tenants/entities/Tenant';

type Store = { dataSource: DataSource; tenant: Tenant };
const als = new AsyncLocalStorage<Store>();

export const runWithTenant = (store: Store, next: () => void) => als.run(store, next);

export const getTenantDS = (): DataSource => {
  const store = als.getStore();
  if (!store) throw new Error('Tenant context not set');
  return store.dataSource;
};

export const getCurrentTenant = (): Tenant => {
  const store = als.getStore();
  if (!store) throw new Error('Tenant context not set');
  return store.tenant;
};