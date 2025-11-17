import 'reflect-metadata';
import { MasterDataSource } from '../config/master-data-source';
import { TenantRepository } from '../modules/tenants/repositories/TenantRepository';
import { garantirFormasPagamentoPadrao } from '../modules/formasPagamento/seeders/formasPagamentoSeeder';
import { garantirCondicoesPagamentoPadrao } from '../modules/condicoesPagamento/seeders/condicoesPagamentoSeeder';
import { tenantDSManager } from '../tenancy/TenantDataSourceManager';

function obterTenantTokenParametro(): string | undefined {
  const argumentos = process.argv.slice(2);

  for (let indice = 0; indice < argumentos.length; indice++) {
    const argumento = argumentos[indice];

    if (argumento.startsWith('--tenant=')) {
      const [, valor] = argumento.split('=');
      return valor?.trim();
    }

    if (argumento === '--tenant' || argumento === '-t') {
      return argumentos[indice + 1]?.trim();
    }
  }

  return undefined;
}

async function executarSeedPagamentos(): Promise<void> {
  let houveErro = false;
  const tenantToken = obterTenantTokenParametro();

  try {
    if (!MasterDataSource.isInitialized) {
      await MasterDataSource.initialize();
    }

    const tenantRepository = new TenantRepository();
    const tenants = await (async () => {
      if (!tenantToken) {
        return tenantRepository.listar();
      }

      const tenant = await tenantRepository.buscarPorToken(tenantToken);
      if (!tenant) {
        throw new Error(`Tenant com identificador ${tenantToken} não encontrado.`);
      }
      return [tenant];
    })();

    if (!tenants.length) {
      console.log('Nenhum tenant cadastrado.');
      return;
    }

    for (const tenant of tenants) {
      try {
        const dataSource = await tenantDSManager.obterDataSourceComMigracoes(tenant);
        await garantirFormasPagamentoPadrao(dataSource);
        await garantirCondicoesPagamentoPadrao(dataSource);
        console.log(`Tenant ${tenant.nomeFantasia || tenant.name} (${tenant.token}): seeders executados.`);
      } catch (erro) {
        houveErro = true;
        console.error(
          `Falha ao executar seeders de pagamento para o tenant ${tenant.nomeFantasia || tenant.name} (${tenant.token}).`,
          erro,
        );
      }
    }
  } catch (erro) {
    houveErro = true;
    console.error('Não foi possível executar os seeders de pagamento.', erro);
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

executarSeedPagamentos();
