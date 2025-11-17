import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { CondicaoPagamento } from '../entities/CondicaoPagamento';
import { ICondicaoPagamentoRepository } from './ICondicaoPagamentoRepository';

export class CondicaoPagamentoRepository implements ICondicaoPagamentoRepository {
  private obterRepositorio(): Repository<CondicaoPagamento> {
    return getTenantDS().getRepository(CondicaoPagamento);
  }

  listar(): Promise<CondicaoPagamento[]> {
    return this.obterRepositorio().find({ order: { descricao: 'ASC' } });
  }

  buscarPorId(id: number): Promise<CondicaoPagamento | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  listarPorFormaPagamento(formaPagamentoId: number): Promise<CondicaoPagamento[]> {
    return this.obterRepositorio().find({
      where: { formaPagamentoId },
      order: { descricao: 'ASC' },
    });
  }

  async criar(dados: Partial<CondicaoPagamento>): Promise<CondicaoPagamento> {
    const repositorio = this.obterRepositorio();
    const condicao = repositorio.create(dados);
    return repositorio.save(condicao);
  }

  salvar(condicao: CondicaoPagamento): Promise<CondicaoPagamento> {
    return this.obterRepositorio().save(condicao);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
