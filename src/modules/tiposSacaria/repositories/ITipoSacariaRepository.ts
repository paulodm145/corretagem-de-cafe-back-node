import { TipoSacaria } from '../entities/TipoSacaria';

export interface ITipoSacariaRepository {
  listar(): Promise<TipoSacaria[]>;
  buscarPorId(id: number): Promise<TipoSacaria | null>;
  buscarPorDescricao(descricao: string): Promise<TipoSacaria | null>;
  criar(dados: Partial<TipoSacaria>): Promise<TipoSacaria>;
  salvar(tipoSacaria: TipoSacaria): Promise<TipoSacaria>;
  remover(id: number): Promise<void>;
}
