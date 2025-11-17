import { ErroAplicacao } from '../../../errors/ErroAplicacao';
import { ObservacaoFiscal } from '../entities/ObservacaoFiscal';
import { IObservacaoFiscalRepository } from '../repositories/IObservacaoFiscalRepository';
import {
  atualizarObservacaoFiscalSchema,
  criarObservacaoFiscalSchema,
  filtroTipoObservacaoSchema,
} from '../validators/observacaoFiscalSchemas';

export class ObservacaoFiscalService {
  constructor(private readonly observacaoFiscalRepository: IObservacaoFiscalRepository) {}

  listar(): Promise<ObservacaoFiscal[]> {
    return this.observacaoFiscalRepository.listar();
  }

  async listarPorTipo(tipoInformado: string): Promise<ObservacaoFiscal[]> {
    const { tipo } = filtroTipoObservacaoSchema.parse({ tipo: tipoInformado });
    return this.observacaoFiscalRepository.listarPorTipo(tipo);
  }

  async buscarPorId(id: number): Promise<ObservacaoFiscal> {
    const observacao = await this.observacaoFiscalRepository.buscarPorId(id);
    if (!observacao) {
      throw new ErroAplicacao('OBSERVACAO_NAO_ENCONTRADA', 'Observação fiscal não encontrada.', 404);
    }
    return observacao;
  }

  criar(payload: unknown): Promise<ObservacaoFiscal> {
    const dados = criarObservacaoFiscalSchema.parse(payload);
    return this.observacaoFiscalRepository.criar({
      descricao: dados.descricao,
      tipo: dados.tipo,
    });
  }

  async atualizar(id: number, payload: unknown): Promise<ObservacaoFiscal> {
    const dados = atualizarObservacaoFiscalSchema.parse(payload);
    const observacao = await this.buscarPorId(id);

    if (typeof dados.descricao === 'string') {
      observacao.descricao = dados.descricao;
    }

    if (dados.tipo) {
      observacao.tipo = dados.tipo;
    }

    return this.observacaoFiscalRepository.salvar(observacao);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.observacaoFiscalRepository.remover(id);
  }
}
