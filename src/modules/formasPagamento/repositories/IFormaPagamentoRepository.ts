import { FormaPagamento } from '../entities/FormaPagamento';

export interface IFormaPagamentoRepository {
  listar(): Promise<FormaPagamento[]>;
  buscarPorId(id: number): Promise<FormaPagamento | null>;
  buscarPorNome(nome: string): Promise<FormaPagamento | null>;
  criar(dados: Partial<FormaPagamento>): Promise<FormaPagamento>;
  salvar(forma: FormaPagamento): Promise<FormaPagamento>;
  remover(id: number): Promise<void>;
}
