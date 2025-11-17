import { Banco } from '../entities/Banco';

export interface IBancoRepository {
  listar(): Promise<Banco[]>;
  buscarPorId(id: number): Promise<Banco | null>;
  buscarPorIspb(ispb: string): Promise<Banco | null>;
  criar(dados: Partial<Banco>): Promise<Banco>;
  salvar(banco: Banco): Promise<Banco>;
  remover(id: number): Promise<void>;
}
