import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Banco } from '../entities/Banco';
import { IBancoRepository } from './IBancoRepository';

export class BancoRepository implements IBancoRepository {
  private obterRepositorio(): Repository<Banco> {
    return getTenantDS().getRepository(Banco);
  }

  async listar(): Promise<Banco[]> {
    return this.obterRepositorio().find({ order: { nome: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<Banco | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async buscarPorIspb(ispb: string): Promise<Banco | null> {
    return this.obterRepositorio().findOne({ where: { ispb } });
  }

  async criar(dados: Partial<Banco>): Promise<Banco> {
    const repositorio = this.obterRepositorio();
    const banco = repositorio.create(dados);
    return repositorio.save(banco);
  }

  async salvar(banco: Banco): Promise<Banco> {
    return this.obterRepositorio().save(banco);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
