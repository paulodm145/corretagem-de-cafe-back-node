import { z } from 'zod';
import { FormaPagamento } from '../entities/FormaPagamento';
import { IFormaPagamentoRepository } from '../repositories/IFormaPagamentoRepository';

const idSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor > 0, 'Identificador inválido.');

const descricaoSchema = z
  .string()
  .trim()
  .min(3, 'Descrição deve possuir ao menos 3 caracteres.')
  .max(150, 'Descrição deve possuir no máximo 150 caracteres.');

const criarFormaSchema = z.object({
  descricao: descricaoSchema,
});

const atualizarFormaSchema = criarFormaSchema
  .partial()
  .refine((dados) => Object.keys(dados).length > 0, 'Envie ao menos um campo para atualizar.');

export class FormaPagamentoService {
  constructor(private readonly formaPagamentoRepository: IFormaPagamentoRepository) {}

  listar(): Promise<FormaPagamento[]> {
    return this.formaPagamentoRepository.listar();
  }

  async buscarPorId(id: number): Promise<FormaPagamento> {
    const forma = await this.formaPagamentoRepository.buscarPorId(id);
    if (!forma) {
      throw new Error('Forma de pagamento não encontrada.');
    }
    return forma;
  }

  async criar(payload: unknown): Promise<FormaPagamento> {
    const dados = criarFormaSchema.parse(this.converterPayloadEmObjeto(payload));
    return this.formaPagamentoRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<FormaPagamento> {
    const forma = await this.buscarPorId(id);
    const dados = atualizarFormaSchema.parse(this.converterPayloadEmObjeto(payload));
    Object.assign(forma, dados);
    return this.formaPagamentoRepository.salvar(forma);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.formaPagamentoRepository.remover(id);
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
