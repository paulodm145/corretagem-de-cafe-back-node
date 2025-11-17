import { ZodError, z } from 'zod';
import { Produto } from '../entities/Produto';
import { IProdutoRepository } from '../repositories/IProdutoRepository';

const descricaoSchema = z
  .string()
  .trim()
  .min(1, 'Descrição é obrigatória.')
  .max(255, 'Descrição deve conter no máximo 255 caracteres.');

const criarProdutoSchema = z.object({
  descricao: descricaoSchema,
});

const atualizarProdutoSchema = z.object({
  descricao: descricaoSchema,
});

export class ProdutoService {
  constructor(private readonly produtoRepository: IProdutoRepository) {}

  async listar(): Promise<Produto[]> {
    return this.produtoRepository.listar();
  }

  async buscarPorId(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.buscarPorId(id);
    if (!produto) {
      throw new Error('Produto não encontrado.');
    }
    return produto;
  }

  async criar(payload: unknown): Promise<Produto> {
    try {
      const { descricao } = criarProdutoSchema.parse(payload);
      return this.produtoRepository.criar({ descricao });
    } catch (erro) {
      this.lancarErroValidacao(erro);
    }
  }

  async atualizar(id: number, payload: unknown): Promise<Produto> {
    const produto = await this.buscarPorId(id);

    try {
      const { descricao } = atualizarProdutoSchema.parse(payload);
      produto.descricao = descricao;
      return this.produtoRepository.salvar(produto);
    } catch (erro) {
      this.lancarErroValidacao(erro);
    }
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.produtoRepository.remover(id);
  }

  private lancarErroValidacao(erro: unknown): never {
    if (erro instanceof ZodError) {
      const mensagem = erro.issues.map((issue) => issue.message).join(' ');
      throw new Error(mensagem);
    }

    throw erro instanceof Error ? erro : new Error('Dados inválidos.');
  }
}
