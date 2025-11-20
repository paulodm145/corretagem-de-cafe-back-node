import { z } from 'zod';
import { DadosEmpresa } from '../entities/DadosEmpresa';
import { IDadosEmpresaRepository } from '../repositories/IDadosEmpresaRepository';
import { DADOS_EMPRESA_PADRAO } from '../seeders/dadosEmpresaSeeder';

const removerNaoNumericos = (valor: string): string => valor.replace(/\D/g, '');

const schemaAtualizacao = z
  .object({
    cnpj: z
      .string()
      .trim()
      .transform(removerNaoNumericos)
      .refine((valor) => valor.length === 14, 'CNPJ deve conter 14 dígitos numéricos.'),
    logoBase64: z.string().trim().min(1, 'Logo em base64 é obrigatória.'),
    email: z
      .string()
      .trim()
      .max(180, 'E-mail deve possuir no máximo 180 caracteres.')
      .email('E-mail inválido.')
      .toLowerCase(),
    telefone: z
      .string()
      .trim()
      .transform(removerNaoNumericos)
      .refine((valor) => valor.length >= 10 && valor.length <= 11, 'Telefone deve conter entre 10 e 11 dígitos.'),
    endereco: z
      .string()
      .trim()
      .min(5, 'Endereço deve possuir ao menos 5 caracteres.')
      .max(255, 'Endereço deve possuir no máximo 255 caracteres.'),
    site: z
      .string()
      .trim()
      .max(200, 'Site deve possuir no máximo 200 caracteres.')
      .url('Site deve ser uma URL válida.')
      .optional()
      .transform((valor) => valor || null),
  })
  .transform((dados) => ({ ...dados, telefone: removerNaoNumericos(dados.telefone), cnpj: removerNaoNumericos(dados.cnpj) }));

export class DadosEmpresaService {
  constructor(private dadosEmpresaRepository: IDadosEmpresaRepository) {}

  async obter(): Promise<DadosEmpresa> {
    const registroExistente = await this.dadosEmpresaRepository.buscarUnico();
    if (registroExistente) {
      return registroExistente;
    }

    return this.dadosEmpresaRepository.criar(DADOS_EMPRESA_PADRAO);
  }

  async atualizar(payload: unknown): Promise<DadosEmpresa> {
    const dadosValidados = schemaAtualizacao.parse(payload);

    let registro = await this.dadosEmpresaRepository.buscarUnico();
    if (!registro) {
      registro = await this.dadosEmpresaRepository.criar(dadosValidados);
      return registro;
    }

    registro.cnpj = dadosValidados.cnpj;
    registro.logoBase64 = dadosValidados.logoBase64;
    registro.email = dadosValidados.email;
    registro.telefone = dadosValidados.telefone;
    registro.endereco = dadosValidados.endereco;
    registro.site = dadosValidados.site ?? null;

    return this.dadosEmpresaRepository.salvar(registro);
  }
}
