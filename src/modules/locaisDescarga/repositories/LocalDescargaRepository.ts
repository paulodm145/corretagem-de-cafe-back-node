import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { LocalDescarga } from '../entities/LocalDescarga';
import { ILocalDescargaRepository } from './ILocalDescargaRepository';

export class LocalDescargaRepository implements ILocalDescargaRepository {
  private obterRepositorio(): Repository<LocalDescarga> {
    return getTenantDS().getRepository(LocalDescarga);
  }

  async listar(): Promise<LocalDescarga[]> {
    return this.obterRepositorio().find({ order: { nome: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<LocalDescarga | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async listarPorCliente(clienteId: number): Promise<LocalDescarga[]> {
    return this.obterRepositorio().find({ where: { clienteId }, order: { nome: 'ASC' } });
  }

  async criar(dados: Partial<LocalDescarga>): Promise<LocalDescarga> {
    const repositorio = this.obterRepositorio();
    const local = repositorio.create(dados);
    return repositorio.save(local);
  }

  async salvar(local: LocalDescarga): Promise<LocalDescarga> {
    return this.obterRepositorio().save(local);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
