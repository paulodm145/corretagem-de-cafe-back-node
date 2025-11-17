import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Cliente } from '../entities/Cliente';
import { IClienteRepository } from './IClienteRepository';

export class ClienteRepository implements IClienteRepository {
  private obterRepositorio(): Repository<Cliente> {
    return getTenantDS().getRepository(Cliente);
  }

  async listar(): Promise<Cliente[]> {
    return this.obterRepositorio().find({ order: { nome: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async buscarPorDocumento(documento: string): Promise<Cliente | null> {
    return this.obterRepositorio().findOne({ where: { documento } });
  }

  async criar(dados: Partial<Cliente>): Promise<Cliente> {
    const repositorio = this.obterRepositorio();
    const cliente = repositorio.create(dados);
    return repositorio.save(cliente);
  }

  async salvar(cliente: Cliente): Promise<Cliente> {
    return this.obterRepositorio().save(cliente);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
