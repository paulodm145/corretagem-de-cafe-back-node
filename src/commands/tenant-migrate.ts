import 'reflect-metadata';
import { MasterDataSource } from '../config/master-data-source';
import { tenantDSManager } from '../tenancy/TenantDataSourceManager';
import { TenantRepository } from '../modules/tenants/repositories/TenantRepository';

async function executarMigracoesTenants() {
  let houveErro = false;

  try {
    if (!MasterDataSource.isInitialized) {
      await MasterDataSource.initialize();
    }
    await MasterDataSource.runMigrations();

    const tenantRepository = new TenantRepository();
    const tenants = await tenantRepository.listar();

    if (tenants.length === 0) {
      console.log('Nenhum tenant cadastrado.');
      return;
    }

    for (const tenant of tenants) {
      try {
        await tenantDSManager.obterDataSourceComMigracoes(tenant);
        console.log(`Migrações aplicadas para o tenant ${tenant.nomeFantasia} (${tenant.token}).`);
      } catch (erro) {
        houveErro = true;
        console.error(
          `Falha ao executar migrações para o tenant ${tenant.nomeFantasia} (${tenant.token}).`,
          erro
        );
      }
    }
  } catch (erro) {
    houveErro = true;
    console.error('Não foi possível executar as migrações dos tenants.', erro);
  } finally {
    await tenantDSManager.closeAll();
    if (MasterDataSource.isInitialized) {
      await MasterDataSource.destroy();
    }
    if (houveErro) {
      process.exitCode = 1;
    }
  }
}

executarMigracoesTenants();
