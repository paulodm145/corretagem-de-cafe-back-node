import { Repository } from 'typeorm';
import { MasterDataSource } from '../../../config/master-data-source';
import { Tenant } from '../entities/Tenant';

export class TenantRepository {
  private get repository(): Repository<Tenant> {
    return MasterDataSource.getRepository(Tenant);
  }

  async listar(): Promise<Tenant[]> {
    return this.repository.find();
  }

  async buscarPorId(id: number): Promise<Tenant | null> {
    return this.repository.findOne({ where: { id } });
  }

  async buscarPorToken(token: string): Promise<Tenant | null> {
    return this.repository.findOne({ where: { token } });
  }

  async criar(dados: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.repository.create(dados);
    return this.repository.save(tenant);
  }

  async salvar(tenant: Tenant): Promise<Tenant> {
    return this.repository.save(tenant);
  }

  async remover(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
