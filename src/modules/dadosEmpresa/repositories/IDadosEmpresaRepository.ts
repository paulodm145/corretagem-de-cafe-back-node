import { DadosEmpresa } from '../entities/DadosEmpresa';

export interface IDadosEmpresaRepository {
  buscarUnico(): Promise<DadosEmpresa | null>;
  criar(dados: Partial<DadosEmpresa>): Promise<DadosEmpresa>;
  salvar(dados: DadosEmpresa): Promise<DadosEmpresa>;
}
