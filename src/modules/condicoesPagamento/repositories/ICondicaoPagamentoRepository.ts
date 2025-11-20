import { CondicaoPagamento } from '../entities/CondicaoPagamento';

export interface ICondicaoPagamentoRepository {
  listar(): Promise<CondicaoPagamento[]>;
  buscarPorId(id: number): Promise<CondicaoPagamento | null>;
  criar(dados: Partial<CondicaoPagamento>): Promise<CondicaoPagamento>;
  salvar(condicao: CondicaoPagamento): Promise<CondicaoPagamento>;
  remover(id: number): Promise<void>;
}
