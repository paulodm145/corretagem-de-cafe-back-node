import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { FormaPagamento } from '../entities/FormaPagamento';
import { IFormaPagamentoRepository } from './IFormaPagamentoRepository';

export class FormaPagamentoRepository implements IFormaPagamentoRepository {
  private obterRepositorio(): Repository<FormaPagamento> {
    return getTenantDS().getRepository(FormaPagamento);
  }

  listar(): Promise<FormaPagamento[]> {
    return this.obterRepositorio().find({ order: { nome: 'ASC' } });
  }

  buscarPorId(id: number): Promise<FormaPagamento | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  buscarPorNome(nome: string): Promise<FormaPagamento | null> {
    return this.obterRepositorio().findOne({ where: { nome } });
  }

  async criar(dados: Partial<FormaPagamento>): Promise<FormaPagamento> {
    const repositorio = this.obterRepositorio();
    const forma = repositorio.create(dados);
    return repositorio.save(forma);
  }

  salvar(forma: FormaPagamento): Promise<FormaPagamento> {
    return this.obterRepositorio().save(forma);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
