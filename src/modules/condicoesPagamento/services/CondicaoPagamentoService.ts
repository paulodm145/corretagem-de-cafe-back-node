import { z } from 'zod';
import { FormaPagamentoRepository } from '../../formasPagamento/repositories/FormaPagamentoRepository';
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

const numeroPositivoOuZeroSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor >= 0, 'Valor deve ser um número inteiro maior ou igual a zero.');

const quantidadeParcelasSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor >= 1 && valor <= 60, 'Quantidade de parcelas deve ser entre 1 e 60.');

const criarCondicaoSchema = z.object({
  formaPagamentoId: idSchema,
  descricao: descricaoSchema,
  quantidadeParcelas: quantidadeParcelasSchema,
  primeiraParcelaEmDias: numeroPositivoOuZeroSchema,
  intervaloDias: numeroPositivoOuZeroSchema,
});

const atualizarCondicaoSchema = criarCondicaoSchema
  .partial()
  .refine((dados) => Object.keys(dados).length > 0, 'Envie ao menos um campo para atualizar.');

export class CondicaoPagamentoService {
  private readonly formaPagamentoRepository = new FormaPagamentoRepository();

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

  async listarPorFormaPagamento(formaPagamentoId: number): Promise<CondicaoPagamento[]> {
    const id = idSchema.parse(formaPagamentoId);
    await this.garantirFormaPagamentoExiste(id);
    return this.condicaoPagamentoRepository.listarPorFormaPagamento(id);
  }

  async criar(payload: unknown): Promise<CondicaoPagamento> {
    const dados = criarCondicaoSchema.parse(this.converterPayloadEmObjeto(payload));
    await this.garantirFormaPagamentoExiste(dados.formaPagamentoId);
    return this.condicaoPagamentoRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<CondicaoPagamento> {
    const condicao = await this.buscarPorId(id);
    const dados = atualizarCondicaoSchema.parse(this.converterPayloadEmObjeto(payload));

    if (dados.formaPagamentoId && dados.formaPagamentoId !== condicao.formaPagamentoId) {
      await this.garantirFormaPagamentoExiste(dados.formaPagamentoId);
    }

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

  private async garantirFormaPagamentoExiste(id: number): Promise<void> {
    const forma = await this.formaPagamentoRepository.buscarPorId(id);
    if (!forma) {
      throw new Error('Forma de pagamento não encontrada.');
    }
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }
}
