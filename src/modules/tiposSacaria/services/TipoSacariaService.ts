import { ZodError } from 'zod';
import { TipoSacaria } from '../entities/TipoSacaria';
import { ITipoSacariaRepository } from '../repositories/ITipoSacariaRepository';
import { atualizarTipoSacariaSchema, criarTipoSacariaSchema } from '../validators/tipoSacariaSchemas';

export class TipoSacariaService {
  constructor(private readonly tipoSacariaRepository: ITipoSacariaRepository) {}

  listar(): Promise<TipoSacaria[]> {
    return this.tipoSacariaRepository.listar();
  }

  async buscarPorId(id: number): Promise<TipoSacaria> {
    const entidade = await this.tipoSacariaRepository.buscarPorId(id);
    if (!entidade) {
      throw new Error('Tipo de sacaria não encontrado.');
    }
    return entidade;
  }

  async criar(payload: unknown): Promise<TipoSacaria> {
    try {
      const dados = criarTipoSacariaSchema.parse(payload);
      await this.garantirDescricaoUnica(dados.descricao);
      return this.tipoSacariaRepository.criar({
        descricao: dados.descricao,
        ativo: dados.ativo ?? true,
      });
    } catch (erro) {
      this.tratarErroValidacao(erro);
    }
  }

  async atualizar(id: number, payload: unknown): Promise<TipoSacaria> {
    try {
      const dados = atualizarTipoSacariaSchema.parse(payload);
      const entidade = await this.buscarPorId(id);

      if (dados.descricao && dados.descricao !== entidade.descricao) {
        await this.garantirDescricaoUnica(dados.descricao);
        entidade.descricao = dados.descricao;
      }

      if (typeof dados.ativo === 'boolean') {
        entidade.ativo = dados.ativo;
      }

      return this.tipoSacariaRepository.salvar(entidade);
    } catch (erro) {
      this.tratarErroValidacao(erro);
    }
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.tipoSacariaRepository.remover(id);
  }

  private async garantirDescricaoUnica(descricao: string): Promise<void> {
    const existente = await this.tipoSacariaRepository.buscarPorDescricao(descricao);
    if (existente) {
      throw new Error('Já existe um tipo de sacaria com esta descrição.');
    }
  }

  private tratarErroValidacao(erro: unknown): never {
    if (erro instanceof ZodError) {
      const mensagem = erro.issues.map((issue) => issue.message).join(' ');
      throw new Error(mensagem);
    }
    throw erro instanceof Error ? erro : new Error('Dados inválidos.');
  }
}
