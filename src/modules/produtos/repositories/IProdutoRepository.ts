import { Produto } from '../entities/Produto';

export interface IProdutoRepository {
  listar(): Promise<Produto[]>;
  buscarPorId(id: number): Promise<Produto | null>;
  criar(dados: Partial<Produto>): Promise<Produto>;
  salvar(produto: Produto): Promise<Produto>;
  remover(id: number): Promise<void>;
}
