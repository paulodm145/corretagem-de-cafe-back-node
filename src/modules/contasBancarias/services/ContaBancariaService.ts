import { z } from 'zod';
import { TipoContaBancaria, mapaCodigoParaTipoContaBancaria } from '../../../ENUMS/tipoContaBancaria';
import { TipoChavePix, mapaCodigoParaTipoChavePix } from '../../../ENUMS/tipoChavePix';
import { BancoRepository } from '../../bancos/repositories/BancoRepository';
import { ClienteRepository } from '../../clientes/repositories/ClienteRepository';
import { ContaBancaria } from '../entities/ContaBancaria';
import { IContaBancariaRepository } from '../repositories/IContaBancariaRepository';

const normalizarEnum = <T extends string>(
  valor: unknown,
  mapaCodigo: Record<number, T>,
  valoresEnum: readonly T[],
): T | unknown => {
  if (typeof valor === 'number' && mapaCodigo[valor]) {
    return mapaCodigo[valor];
  }

  if (typeof valor === 'string') {
    const numero = Number(valor);
    if (!Number.isNaN(numero) && mapaCodigo[numero]) {
      return mapaCodigo[numero];
    }

    const upper = valor.trim().toUpperCase();
    const encontrado = valoresEnum.find((opcao) => opcao === upper as T);
    if (encontrado) {
      return encontrado;
    }
  }

  return valor;
};

const numeroPositivoSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor > 0, 'Identificador inválido.');

const agenciaSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => String(valor).trim())
  .transform((valor) => valor.replace(/\s+/g, ''))
  .transform((valor) => valor.replace(/[^0-9A-Za-z]/g, '').toUpperCase())
  .refine((valor) => valor.length >= 3 && valor.length <= 20, 'Agência deve ter entre 3 e 20 caracteres.');

const numeroContaSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => String(valor).trim())
  .transform((valor) => valor.replace(/\s+/g, ''))
  .transform((valor) => valor.replace(/[^0-9A-Za-z]/g, '').toUpperCase())
  .refine((valor) => valor.length >= 3 && valor.length <= 30, 'Número da conta deve ter entre 3 e 30 caracteres.');

const digitoContaSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => String(valor).trim())
  .transform((valor) => valor.replace(/\s+/g, ''))
  .transform((valor) => valor.replace(/[^0-9A-Za-z]/g, '').toUpperCase())
  .refine((valor) => valor.length >= 1 && valor.length <= 5, 'Dígito deve ter entre 1 e 5 caracteres.')
  .optional()
  .transform((valor) => (valor ? valor : null));

const tipoContaSchema = z
  .preprocess(
    (valor) => normalizarEnum(valor, mapaCodigoParaTipoContaBancaria, Object.values(TipoContaBancaria)),
    z.nativeEnum(TipoContaBancaria),
  )
  .optional()
  .transform((valor) => (valor ? valor : null));

const tipoChavePixSchema = z
  .preprocess((valor) => normalizarEnum(valor, mapaCodigoParaTipoChavePix, Object.values(TipoChavePix)), z.nativeEnum(TipoChavePix))
  .optional()
  .transform((valor) => (valor ? valor : null));

const chavePixSchema = z
  .string()
  .trim()
  .max(180, 'Chave PIX deve possuir no máximo 180 caracteres.')
  .optional()
  .transform((valor) => (valor ? valor : null));

const contaBancariaSchema = z
  .object({
    clienteId: numeroPositivoSchema,
    bancoId: numeroPositivoSchema,
    agencia: agenciaSchema,
    numeroConta: numeroContaSchema,
    digitoConta: digitoContaSchema,
    tipoConta: tipoContaSchema,
    tipoChavePix: tipoChavePixSchema,
    chavePix: chavePixSchema,
  })
  .superRefine((dados, ctx) => {
    if ((dados.tipoChavePix && !dados.chavePix) || (!dados.tipoChavePix && dados.chavePix)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Informe tipo de chave e chave PIX em conjunto.',
        path: dados.tipoChavePix ? ['chavePix'] : ['tipoChavePix'],
      });
    }
  });

const atualizarContaBancariaSchema = contaBancariaSchema.partial().refine(
  (dados) => Object.keys(dados).length > 0,
  'Envie ao menos um campo para atualizar.',
);

export class ContaBancariaService {
  private readonly clienteRepository = new ClienteRepository();
  private readonly bancoRepository = new BancoRepository();

  constructor(private readonly contaBancariaRepository: IContaBancariaRepository) {}

  async listar(): Promise<ContaBancaria[]> {
    return this.contaBancariaRepository.listar();
  }

  async listarPorCliente(clienteId: number): Promise<ContaBancaria[]> {
    const id = numeroPositivoSchema.parse(clienteId);
    await this.garantirClienteExiste(id);
    return this.contaBancariaRepository.listarPorCliente(id);
  }

  async buscarPorId(id: number): Promise<ContaBancaria> {
    const conta = await this.contaBancariaRepository.buscarPorId(id);
    if (!conta) {
      throw new Error('Conta bancária não encontrada.');
    }
    return conta;
  }

  async criar(payload: unknown): Promise<ContaBancaria> {
    const dados = contaBancariaSchema.parse(this.converterPayloadEmObjeto(payload));
    await this.garantirClienteExiste(dados.clienteId);
    await this.garantirBancoExiste(dados.bancoId);
    return this.contaBancariaRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<ContaBancaria> {
    const conta = await this.buscarPorId(id);
    const dadosAtualizados = atualizarContaBancariaSchema.parse(this.converterPayloadEmObjeto(payload));

    if (dadosAtualizados.clienteId && dadosAtualizados.clienteId !== conta.clienteId) {
      await this.garantirClienteExiste(dadosAtualizados.clienteId);
    }

    if (dadosAtualizados.bancoId && dadosAtualizados.bancoId !== conta.bancoId) {
      await this.garantirBancoExiste(dadosAtualizados.bancoId);
    }

    Object.assign(conta, dadosAtualizados);
    return this.contaBancariaRepository.salvar(conta);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.contaBancariaRepository.remover(id);
  }

  private async garantirClienteExiste(id: number): Promise<void> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }
  }

  private async garantirBancoExiste(id: number): Promise<void> {
    const banco = await this.bancoRepository.buscarPorId(id);
    if (!banco) {
      throw new Error('Banco não encontrado.');
    }
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }
}
