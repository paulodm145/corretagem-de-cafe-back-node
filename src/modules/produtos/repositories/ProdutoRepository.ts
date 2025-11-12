import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Produto } from '../entities/Produto';
import { IProdutoRepository } from './IProdutoRepository';

export class ProdutoRepository implements IProdutoRepository {
  private obterRepositorio(): Repository<Produto> {
    return getTenantDS().getRepository(Produto);
  }

  async listar(): Promise<Produto[]> {
    return this.obterRepositorio().find({ order: { descricao: 'ASC' } });
  }

  async buscarPorId(id: string): Promise<Produto | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async criar(dados: Partial<Produto>): Promise<Produto> {
    const repositorio = this.obterRepositorio();
    const produto = repositorio.create(dados);
    return repositorio.save(produto);
  }

  async salvar(produto: Produto): Promise<Produto> {
    return this.obterRepositorio().save(produto);
  }

  async remover(id: string): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
