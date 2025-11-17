import { z } from 'zod';
import { ClienteRepository } from '../../clientes/repositories/ClienteRepository';
import { Cliente } from '../../clientes/entities/Cliente';
import { LocalDescarga } from '../entities/LocalDescarga';
import { ILocalDescargaRepository } from '../repositories/ILocalDescargaRepository';

const numeroPositivoSchema = z
  .union([z.string(), z.number()])
  .transform((valor) => Number(valor))
  .refine((valor) => Number.isInteger(valor) && valor > 0, 'Identificador inválido.');

const nomeSchema = z
  .string()
  .trim()
  .min(3, 'Nome deve possuir ao menos 3 caracteres.')
  .max(255, 'Nome deve possuir no máximo 255 caracteres.');

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

const ufSchema = z
  .string()
  .trim()
  .transform((valor) => valor.toUpperCase())
  .refine((valor) => /^[A-Z]{2}$/.test(valor), 'UF deve possuir duas letras.');

const cidadeSchema = z
  .string()
  .trim()
  .min(2, 'Cidade deve possuir ao menos 2 caracteres.')
  .max(120, 'Cidade deve possuir no máximo 120 caracteres.');

const localDescargaSchema = z.object({
  clienteId: numeroPositivoSchema,
  nome: nomeSchema,
  cep: cepSchema,
  endereco: enderecoSchema,
  numero: numeroSchema,
  complemento: complementoSchema,
  bairro: bairroSchema,
  uf: ufSchema,
  cidade: cidadeSchema,
});

const atualizarLocalDescargaSchema = localDescargaSchema.partial().refine(
  (dados) => Object.keys(dados).length > 0,
  'Envie ao menos um campo para atualizar.',
);

export class LocalDescargaService {
  private readonly clienteRepository = new ClienteRepository();

  constructor(private readonly localDescargaRepository: ILocalDescargaRepository) {}

  async listar(): Promise<LocalDescarga[]> {
    return this.localDescargaRepository.listar();
  }

  async buscarPorId(id: number): Promise<LocalDescarga> {
    const local = await this.localDescargaRepository.buscarPorId(id);
    if (!local) {
      throw new Error('Local de descarga não encontrado.');
    }
    return local;
  }

  async listarPorCliente(clienteId: number): Promise<LocalDescarga[]> {
    const id = numeroPositivoSchema.parse(clienteId);
    await this.garantirClienteExiste(id);
    return this.localDescargaRepository.listarPorCliente(id);
  }

  async criar(payload: unknown): Promise<LocalDescarga> {
    const dados = localDescargaSchema.parse(this.converterPayloadEmObjeto(payload));
    await this.garantirClienteExiste(dados.clienteId);
    return this.localDescargaRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<LocalDescarga> {
    const local = await this.buscarPorId(id);
    const dadosAtualizados = atualizarLocalDescargaSchema.parse(this.converterPayloadEmObjeto(payload));

    if (dadosAtualizados.clienteId && dadosAtualizados.clienteId !== local.clienteId) {
      await this.garantirClienteExiste(dadosAtualizados.clienteId);
    }

    Object.assign(local, dadosAtualizados);
    return this.localDescargaRepository.salvar(local);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.localDescargaRepository.remover(id);
  }

  private async garantirClienteExiste(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.buscarPorId(id);
    if (!cliente) {
      throw new Error('Cliente não encontrado.');
    }
    return cliente;
  }

  private converterPayloadEmObjeto(payload: unknown): Record<string, unknown> {
    if (!payload || typeof payload !== 'object') {
      return {};
    }
    return payload as Record<string, unknown>;
  }
}
