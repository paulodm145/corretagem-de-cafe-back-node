import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Estado } from '../entities/Estado';
import { IEstadoRepository } from './IEstadoRepository';

// DTO para lista simplificada
export interface EstadoListaDTO {
  nome: string;
  sigla: string;
}

export class EstadoRepository implements IEstadoRepository {
  private obterRepositorio(): Repository<Estado> {
    return getTenantDS().getRepository(Estado);
  }

  async findAll(): Promise<Estado[]> {
    const repositorio = this.obterRepositorio();
    return repositorio.find();
  }
}
