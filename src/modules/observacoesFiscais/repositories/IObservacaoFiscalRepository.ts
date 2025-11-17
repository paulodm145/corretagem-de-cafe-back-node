import { TipoObservacaoFiscal } from '../../../ENUMS/tipoObservacaoFiscal';
import { ObservacaoFiscal } from '../entities/ObservacaoFiscal';

export interface IObservacaoFiscalRepository {
  listar(): Promise<ObservacaoFiscal[]>;
  listarPorTipo(tipo: TipoObservacaoFiscal): Promise<ObservacaoFiscal[]>;
  buscarPorId(id: number): Promise<ObservacaoFiscal | null>;
  criar(dados: Partial<ObservacaoFiscal>): Promise<ObservacaoFiscal>;
  salvar(entidade: ObservacaoFiscal): Promise<ObservacaoFiscal>;
  remover(id: number): Promise<void>;
}
