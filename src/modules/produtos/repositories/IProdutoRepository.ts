import { Produto } from '../entities/Produto';

export interface IProdutoRepository {
  listar(): Promise<Produto[]>;
  buscarPorId(id: string): Promise<Produto | null>;
  criar(dados: Partial<Produto>): Promise<Produto>;
  salvar(produto: Produto): Promise<Produto>;
  remover(id: string): Promise<void>;
}
