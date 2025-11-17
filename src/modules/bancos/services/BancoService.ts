import { ZodError, z } from 'zod';
import { Banco } from '../entities/Banco';
import { IBancoRepository } from '../repositories/IBancoRepository';

const codigoSchema = z
  .union([
    z
      .coerce.number()
      .refine((valor: number) => Number.isInteger(valor), 'Código deve ser um número inteiro.')
      .refine((valor: number) => valor > 0, 'Código deve ser maior que zero.'),
    z.null(),
  ])
  .optional();

const ispbSchema = z
  .string()
  .trim()
  .transform((valor: string) => valor.replace(/\D/g, ''))
  .refine((valor: string) => valor.length === 8, 'ISPB deve conter 8 dígitos numéricos.');

const nomeSchema = z
  .string()
  .trim()
  .min(2, 'Nome deve possuir ao menos 2 caracteres.')
  .max(150, 'Nome deve possuir no máximo 150 caracteres.');

const nomeCompletoSchema = z
  .string()
  .trim()
  .min(2, 'Nome completo deve possuir ao menos 2 caracteres.')
  .max(255, 'Nome completo deve possuir no máximo 255 caracteres.');

const bancoSchema = z.object({
  codigo: codigoSchema,
  ispb: ispbSchema,
  nome: nomeSchema,
  nomeCompleto: nomeCompletoSchema,
});

type BancoPayload = z.infer<typeof bancoSchema>;
type BancoNormalizado = Pick<Banco, 'codigo' | 'ispb' | 'nome' | 'nomeCompleto'>;

export class BancoService {
  constructor(private readonly bancoRepository: IBancoRepository) {}

  async listar(): Promise<Banco[]> {
    return this.bancoRepository.listar();
  }

  async buscarPorId(id: number): Promise<Banco> {
    const banco = await this.bancoRepository.buscarPorId(id);
    if (!banco) {
      throw new Error('Banco não encontrado.');
    }
    return banco;
  }

  async criar(payload: unknown): Promise<Banco> {
    const dados = this.validarPayload(payload);
    await this.garantirIspbDisponivel(dados.ispb);
    return this.bancoRepository.criar(dados);
  }

  async atualizar(id: number, payload: unknown): Promise<Banco> {
    const banco = await this.buscarPorId(id);
    const dados = this.validarPayload(payload);

    if (dados.ispb !== banco.ispb) {
      await this.garantirIspbDisponivel(dados.ispb, banco.id);
    }

    banco.codigo = dados.codigo;
    banco.nome = dados.nome;
    banco.nomeCompleto = dados.nomeCompleto;
    banco.ispb = dados.ispb;

    return this.bancoRepository.salvar(banco);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.bancoRepository.remover(id);
  }

  private validarPayload(payload: unknown): BancoNormalizado {
    try {
      const dados: BancoPayload = bancoSchema.parse(payload);
      return {
        codigo: typeof dados.codigo === 'number' ? dados.codigo : null,
        ispb: dados.ispb,
        nome: dados.nome,
        nomeCompleto: dados.nomeCompleto,
      };
    } catch (erro) {
      this.lancarErroValidacao(erro);
    }
  }

  private async garantirIspbDisponivel(ispb: string, ignorarId?: number): Promise<void> {
    const existente = await this.bancoRepository.buscarPorIspb(ispb);
    if (existente && existente.id !== ignorarId) {
      throw new Error('Já existe um banco cadastrado com este ISPB.');
    }
  }

  private lancarErroValidacao(erro: unknown): never {
    if (erro instanceof ZodError) {
      const mensagem = erro.issues.map((issue) => issue.message).join(' ');
      throw new Error(mensagem);
    }

    throw erro instanceof Error ? erro : new Error('Dados inválidos.');
  }
}
