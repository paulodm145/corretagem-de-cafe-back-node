import { ListaPaginada, ParametrosListagem } from '../../../utils/paginacao';
import { Cliente } from '../entities/Cliente';

export interface IClienteRepository {
  listar(parametros: ParametrosListagem): Promise<ListaPaginada<Cliente>>;
  buscarPorId(id: number): Promise<Cliente | null>;
  buscarPorDocumento(documento: string): Promise<Cliente | null>;
  criar(dados: Partial<Cliente>): Promise<Cliente>;
  salvar(cliente: Cliente): Promise<Cliente>;
  remover(id: number): Promise<void>;
}
