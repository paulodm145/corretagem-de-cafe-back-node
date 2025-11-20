import { z } from 'zod';
import { AtuacaoCliente, mapaCodigoParaAtuacaoCliente } from '../../../ENUMS/atuacaoCliente';
import { TipoCompradorCliente, mapaCodigoParaTipoCompradorCliente } from '../../../ENUMS/tipoCompradorCliente';
import { TipoPessoaCliente, mapaCodigoParaTipoPessoaCliente } from '../../../ENUMS/tipoPessoaCliente';
import { ListaPaginada, criarSchemaListagem } from '../../../utils/paginacao';
import { Cliente } from '../entities/Cliente';
import { IClienteRepository } from '../repositories/IClienteRepository';
import { EstadoRepository } from '../../estados/repositories/Estadorepository';
import { CidadeRepository } from '../../cidades/repositories/CidadeRepository';

const VALOR_MAX_OBSERVACAO = 4000;

const transformarValorEnum = <T extends string>(
  valor: unknown,
  mapaCodigo: Record<number, T>,
  valoresEnum: readonly T[],
): T | unknown => {
  if (typeof valor === 'number') {
    const mapeado = mapaCodigo[valor];
    if (mapeado) {
      return mapeado;
    }
  }

  if (typeof valor === 'string') {
    const numero = Number(valor);
    if (!Number.isNaN(numero) && mapaCodigo[numero]) {
      return mapaCodigo[numero];
    }

    const upper = valor.trim().toUpperCase();
    const encontrado = valoresEnum.find((opcao) => opcao === upper);
    if (encontrado) {
      return encontrado;
    }
  }

  return valor;
};

const tipoPessoaSchema = z.preprocess(
  (valor) => transformarValorEnum(valor, mapaCodigoParaTipoPessoaCliente, Object.values(TipoPessoaCliente)),
  z.nativeEnum(TipoPessoaCliente),
);

const tipoCompradorSchema = z.preprocess(
  (valor) => transformarValorEnum(valor, mapaCodigoParaTipoCompradorCliente, Object.values(TipoCompradorCliente)),
  z.nativeEnum(TipoCompradorCliente),
);

const atuacaoSchema = z.preprocess(
  (valor) => transformarValorEnum(valor, mapaCodigoParaAtuacaoCliente, Object.values(AtuacaoCliente)),
  z.nativeEnum(AtuacaoCliente),
);

const nomeSchema = z
  .string()
  .trim()
  .min(3, 'Nome deve possuir ao menos 3 caracteres.')
  .max(255, 'Nome deve possuir no máximo 255 caracteres.');

const documentoSchema = z
  .string()
  .trim()
  .transform((valor) => valor.replace(/\D/g, ''))
  .refine((valor) => valor.length === 11 || valor.length === 14, 'Documento deve conter 11 ou 14 dígitos numéricos.');

const inscricaoEstadualSchema = z
  .string()
  .trim()
  .max(20, 'Inscrição estadual deve ter no máximo 20 caracteres.')
  .optional()
  .transform((valor) => (valor ? valor : null));

const dataNascimentoSchema = z.preprocess((valor) => {
  if (valor instanceof Date) {
    return valor;
  }
  if (typeof valor === 'string') {
    const texto = valor.trim();
    if (!texto) {
      return valor;
    }
    const data = new Date(texto);
    if (!Number.isNaN(data.getTime())) {
      return data;
    }
  }
  return valor;
}, z.date());

const cepSchema = z
  .string()
  .trim()
  .transform((valor) => valor.replace(/\D/g, ''))
  .refine((valor) => valor.length === 8, 'CEP deve conter 8 dígitos.');

const enderecoSchema = z
  .string()
  .trim()
  .min(3, 'Endereço deve possuir ao menos 3 caracteres.')
  .max(255, 'Endereço deve possuir no máximo 255 caracteres.');

const numeroSchema = z
  .string()
  .trim()
  .min(1, 'Número é obrigatório.')
  .max(20, 'Número deve possuir no máximo 20 caracteres.');

const complementoSchema = z
  .string()
  .trim()
  .max(100, 'Complemento deve possuir no máximo 100 caracteres.')
  .optional()
  .transform((valor) => (valor ? valor : null));

const bairroSchema = z
  .string()
  .trim()
  .min(2, 'Bairro deve possuir ao menos 2 caracteres.')
  .max(120, 'Bairro deve possuir no máximo 120 caracteres.');

const numeroPositivoSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor > 0, 'Identificador inválido.');

const emailSchema = z
  .string()
  .trim()
  .max(180, 'E-mail deve possuir no máximo 180 caracteres.')
  .email('E-mail inválido.')
  .optional()
  .transform((valor) => (valor ? valor.toLowerCase() : null));

const telefoneSchema = z
  .string()
  .trim()
  .transform((valor) => valor.replace(/\D/g, ''))
  .refine((valor) => valor.length >= 10 && valor.length <= 11, 'Telefone deve conter entre 10 e 11 dígitos.');

const observacaoSchema = z
  .string()
  .trim()
  .max(VALOR_MAX_OBSERVACAO, `Observação deve possuir no máximo ${VALOR_MAX_OBSERVACAO} caracteres.`)
  .optional()
  .transform((valor) => (valor ? valor : null));

const numeroCarSchema = z
  .string()
  .trim()
  .max(30, 'Número do CAR deve possuir no máximo 30 caracteres.')
  .optional()
  .transform((valor) => (valor ? valor : null));

const alterarStatusSchema = z.object({
  ativo: z.boolean(),
});

const clienteSchema = z
  .object({
    nome: nomeSchema,
    tipoPessoa: tipoPessoaSchema,
    documento: documentoSchema,
    inscricaoEstadual: inscricaoEstadualSchema,
    tipoComprador: tipoCompradorSchema,
    atuacao: atuacaoSchema,
    dataNascimento: dataNascimentoSchema,
    cep: cepSchema,
    endereco: enderecoSchema,
    numero: numeroSchema,
    complemento: complementoSchema,
    bairro: bairroSchema,
    estadoId: numeroPositivoSchema,
    cidadeId: numeroPositivoSchema,
    email: emailSchema,
    telefone: telefoneSchema,
    observacao: observacaoSchema,
    numeroCar: numeroCarSchema,
  })
  .superRefine((dados, ctx) => {
    if (dados.tipoPessoa === TipoPessoaCliente.PESSOA_FISICA && dados.documento.length !== 11) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF deve conter 11 dígitos.', path: ['documento'] });
    }
    if (dados.tipoPessoa === TipoPessoaCliente.PESSOA_JURIDICA && dados.documento.length !== 14) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CNPJ deve conter 14 dígitos.', path: ['documento'] });
    }
  });

type ClienteNormalizado = z.infer<typeof clienteSchema>;

const parametrosListagemClientesSchema = criarSchemaListagem({
  camposOrdenacao: ['nome', 'documento', 'createdAt'],
  ordenarPorPadrao: 'nome',
});

export class ClienteService {
  private readonly estadoRepository = new EstadoRepository();
  private readonly cidadeRepository = new CidadeRepository();

  constructor(private readonly clienteRepository: IClienteRepository) {}

  async listar(parametros?: unknown): Promise<ListaPaginada<Cliente>> {
    const filtros = parametrosListagemClientesSchema.parse(this.converterPayloadEmObjeto(parametros));
    return this.clienteRepository.listar(filtros);
  }

  async buscarPorId(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }
    return cliente;
  }

  async criar(payload: unknown): Promise<Cliente> {
    const dados = this.validarPayload(payload);
    await this.garantirDocumentoDisponivel(dados.documento);
    await this.garantirEstadoExiste(dados.estadoId);
    await this.garantirCidadeExiste(dados.cidadeId, dados.estadoId);
    return this.clienteRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    this.validarPayloadAtualizacaoObrigatoria(payload);
    const dados = this.validarPayload(payload, cliente);

    if (dados.documento !== cliente.documento) {
      await this.garantirDocumentoDisponivel(dados.documento, cliente.id);
    }

    if (dados.estadoId !== cliente.estadoId) {
      await this.garantirEstadoExiste(dados.estadoId);
    }

    if (dados.cidadeId !== cliente.cidadeId) {
      await this.garantirCidadeExiste(dados.cidadeId, dados.estadoId ?? cliente.estadoId);
    }

    Object.assign(cliente, dados);
    return this.clienteRepository.salvar(cliente);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.clienteRepository.remover(id);
  }

  async atualizarStatus(id: number, payload: unknown): Promise<Cliente> {
    const cliente = await this.buscarPorId(id);
    const dados = alterarStatusSchema.parse(this.converterPayloadEmObjeto(payload));
    cliente.ativo = dados.ativo;
    return this.clienteRepository.salvar(cliente);
  }

  private validarPayload(payload: unknown, base?: Cliente): ClienteNormalizado {
    const objeto = this.converterPayloadEmObjeto(payload);
    const dadosBase = base
      ? {
          nome: base.nome,
          tipoPessoa: base.tipoPessoa,
          documento: base.documento,
          inscricaoEstadual: base.inscricaoEstadual,
          tipoComprador: base.tipoComprador,
          atuacao: base.atuacao,
          dataNascimento: base.dataNascimento,
          cep: base.cep,
          endereco: base.endereco,
          numero: base.numero,
          complemento: base.complemento,
          bairro: base.bairro,
          estadoId: base.estadoId,
          cidadeId: base.cidadeId,
          email: base.email,
          telefone: base.telefone,
          observacao: base.observacao,
          numeroCar: base.numeroCar,
        }
      : {};

    const dadosParaValidar = base ? { ...dadosBase, ...objeto } : objeto;
    return clienteSchema.parse(dadosParaValidar);
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }

  private validarPayloadAtualizacaoObrigatoria(payload: unknown): void {
    if (!payload || typeof payload !== 'object' || Object.keys(payload as Record<string, unknown>).length === 0) {
      throw new Error('Envie ao menos um campo para atualizar.');
    }
  }

  private async garantirDocumentoDisponivel(documento: string, ignorarId?: number): Promise<void> {
    const existente = await this.clienteRepository.buscarPorDocumento(documento);
    if (existente && existente.id !== ignorarId) {
      throw new Error('Já existe um cliente cadastrado com este documento.');
    }
  }

  private async garantirEstadoExiste(id: number): Promise<void> {
    const estado = await this.estadoRepository.findById(id);
    if (!estado) {
      throw new Error('Estado não encontrado.');
    }
  }

  private async garantirCidadeExiste(id: number, estadoId?: number): Promise<void> {
    const cidade = await this.cidadeRepository.buscarPorId(id);
    if (!cidade) {
      throw new Error('Cidade não encontrada.');
    }

    if (estadoId && cidade.estadoId !== estadoId) {
      throw new Error('Cidade informada não pertence ao estado selecionado.');
    }
  }
}
