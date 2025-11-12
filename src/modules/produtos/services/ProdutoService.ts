import { Produto } from '../entities/Produto';
import { IProdutoRepository } from '../repositories/IProdutoRepository';

type CriarProdutoDTO = {
  descricao?: string | null;
};

type AtualizarProdutoDTO = Partial<CriarProdutoDTO>;

export class ProdutoService {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async listar(): Promise<Produto[]> {
    return this.produtoRepository.listar();
  }

  async buscarPorId(id: string): Promise<Produto> {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    return produto;
  }

  async criar(dados: CriarProdutoDTO): Promise<Produto> {
    const descricao = this.validarDescricao(dados.descricao);
    return this.produtoRepository.criar({ descricao });
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO): Promise<Produto> {
    const produto = await this.buscarPorId(id);

    if (dados.descricao !== undefined) {
      produto.descricao = this.validarDescricao(dados.descricao);
    }

    return this.produtoRepository.salvar(produto);
  }

  async remover(id: string): Promise<void> {
    await this.buscarPorId(id);
    await this.produtoRepository.remover(id);
  }

  private validarDescricao(descricao?: string): string {
    const descricaoNormalizada = descricao?.trim();
    if (!descricaoNormalizada) {
      throw new Error('Descrição é obrigatória.');
    }

    if (descricaoNormalizada.length > 255) {
      throw new Error('Descrição deve conter no máximo 255 caracteres.');
    }

    return descricaoNormalizada;
  }
}
