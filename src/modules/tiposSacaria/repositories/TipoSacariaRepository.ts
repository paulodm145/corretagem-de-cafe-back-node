import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { TipoSacaria } from '../entities/TipoSacaria';
import { ITipoSacariaRepository } from './ITipoSacariaRepository';

export class TipoSacariaRepository implements ITipoSacariaRepository {
  private obterRepositorio(): Repository<TipoSacaria> {
    return getTenantDS().getRepository(TipoSacaria);
  }

  listar(): Promise<TipoSacaria[]> {
    return this.obterRepositorio().find({ order: { descricao: 'ASC' } });
  }

  buscarPorId(id: number): Promise<TipoSacaria | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  buscarPorDescricao(descricao: string): Promise<TipoSacaria | null> {
    return this.obterRepositorio().findOne({ where: { descricao } });
  }

  async criar(dados: Partial<TipoSacaria>): Promise<TipoSacaria> {
    const repositorio = this.obterRepositorio();
    const entidade = repositorio.create(dados);
    return repositorio.save(entidade);
  }

  salvar(tipoSacaria: TipoSacaria): Promise<TipoSacaria> {
    return this.obterRepositorio().save(tipoSacaria);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
