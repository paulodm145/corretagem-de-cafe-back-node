import { z } from 'zod';
import { ListaPaginada, criarSchemaListagem } from '../../../utils/paginacao';
import { Venda } from '../entities/Venda';
import { IVendaRepository } from '../repositories/IVendaRepository';

const parametrosListagemVendasSchema = criarSchemaListagem({
  camposOrdenacao: ['dataVenda', 'numeroContrato', 'status', 'createdAt', 'clienteNome'],
  ordenarPorPadrao: 'dataVenda',
});

type ParametrosListagemVendas = z.infer<typeof parametrosListagemVendasSchema>;

export class VendaService {
  constructor(private readonly vendaRepository: IVendaRepository) {}

  async listar(parametros?: unknown): Promise<ListaPaginada<Venda>> {
    const filtros = parametrosListagemVendasSchema.parse(this.converterPayloadEmObjeto(parametros));
    return this.vendaRepository.listar(filtros);
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }
}
