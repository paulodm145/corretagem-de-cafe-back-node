import { z } from 'zod';
import { CondicaoPagamento } from '../entities/CondicaoPagamento';
import { ICondicaoPagamentoRepository } from '../repositories/ICondicaoPagamentoRepository';

const idSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor > 0, 'Identificador inválido.');

const descricaoSchema = z
  .string()
  .trim()
  .min(3, 'Descrição deve possuir ao menos 3 caracteres.')
  .max(150, 'Descrição deve possuir no máximo 150 caracteres.');

const criarCondicaoSchema = z.object({
  descricao: descricaoSchema,
});

const atualizarCondicaoSchema = criarCondicaoSchema
  .partial()
  .refine((dados) => Object.keys(dados).length > 0, 'Envie ao menos um campo para atualizar.');

export class CondicaoPagamentoService {
  constructor(private readonly condicaoPagamentoRepository: ICondicaoPagamentoRepository) {}

  listar(): Promise<CondicaoPagamento[]> {
    return this.condicaoPagamentoRepository.listar();
  }

  async buscarPorId(id: number): Promise<CondicaoPagamento> {
    const condicao = await this.condicaoPagamentoRepository.buscarPorId(id);
    if (!condicao) {
      throw new Error('Condição de pagamento não encontrada.');
    }
    return condicao;
  }

  async criar(payload: unknown): Promise<CondicaoPagamento> {
    const dados = criarCondicaoSchema.parse(this.converterPayloadEmObjeto(payload));
    return this.condicaoPagamentoRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<CondicaoPagamento> {
    const condicao = await this.buscarPorId(id);
    const dados = atualizarCondicaoSchema.parse(this.converterPayloadEmObjeto(payload));

    Object.assign(condicao, dados);
    return this.condicaoPagamentoRepository.salvar(condicao);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.condicaoPagamentoRepository.remover(id);
  }

  validarId(param: unknown): number {
    return idSchema.parse(param);
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }
}
