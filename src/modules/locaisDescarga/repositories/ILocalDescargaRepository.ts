import { LocalDescarga } from '../entities/LocalDescarga';

export interface ILocalDescargaRepository {
  listar(): Promise<LocalDescarga[]>;
  buscarPorId(id: number): Promise<LocalDescarga | null>;
  listarPorCliente(clienteId: number): Promise<LocalDescarga[]>;
  criar(dados: Partial<LocalDescarga>): Promise<LocalDescarga>;
  salvar(local: LocalDescarga): Promise<LocalDescarga>;
  remover(id: number): Promise<void>;
}
