import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Cidade } from '../entities/Cidade';
import { ICidadeRepository } from './ICidadeRepository';

export class CidadeRepository implements ICidadeRepository {
  async buscarPorId(id: number): Promise<Cidade | null> {
    const repositorio = this.obterRepositorio();
    return repositorio.findOne({ where: { id } });
  }

  async findByUf(uf: string): Promise<Cidade[]> {
    const siglaEstado = uf.trim().toUpperCase();
    const repositorio = this.obterRepositorio();

    return repositorio
      .createQueryBuilder('cidade')
      .leftJoin('cidade.estado', 'estado')
      .where('estado.sigla = :uf', { uf: siglaEstado })
      .getMany();
  }

  private obterRepositorio(): Repository<Cidade> {
    return getTenantDS().getRepository(Cidade);
  }
}
