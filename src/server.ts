import { app } from './app';
import { MasterDataSource } from './config/master-data-source';
import { tenantDSManager } from './tenancy/TenantDataSourceManager';

const port = Number(process.env.PORT || 3333);

async function bootstrap() {
  try {
    await MasterDataSource.initialize();
    await MasterDataSource.runMigrations();
    console.log('[CORE] conectado');

    app.listen(port, () => {
      console.log(`[HTTP] http://localhost:${port}`);
    });

    // boa prática ao encerrar
    process.on('SIGINT', async () => {
      await tenantDSManager.closeAll();
      await MasterDataSource.destroy();
      process.exit(0);
    });
  } catch (err) {
    console.error('[CORE] erro ao iniciar:', err);
    process.exit(1);
  }
}

bootstrap();