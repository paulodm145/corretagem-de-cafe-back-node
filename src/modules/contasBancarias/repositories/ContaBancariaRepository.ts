import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { ContaBancaria } from '../entities/ContaBancaria';
import { IContaBancariaRepository } from './IContaBancariaRepository';

export class ContaBancariaRepository implements IContaBancariaRepository {
  private obterRepositorio(): Repository<ContaBancaria> {
    return getTenantDS().getRepository(ContaBancaria);
  }

  async listar(): Promise<ContaBancaria[]> {
    return this.obterRepositorio().find({ relations: ['banco'], order: { id: 'ASC' } });
  }

  async listarPorCliente(clienteId: number): Promise<ContaBancaria[]> {
    return this.obterRepositorio().find({ where: { clienteId }, relations: ['banco'], order: { id: 'ASC' } });
  }

  async buscarPorId(id: number): Promise<ContaBancaria | null> {
    return this.obterRepositorio().findOne({ where: { id }, relations: ['banco'] });
  }

  async criar(dados: Partial<ContaBancaria>): Promise<ContaBancaria> {
    const repositorio = this.obterRepositorio();
    const conta = repositorio.create(dados);
    return repositorio.save(conta);
  }

  async salvar(conta: ContaBancaria): Promise<ContaBancaria> {
    return this.obterRepositorio().save(conta);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
