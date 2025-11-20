import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { DadosEmpresa } from '../entities/DadosEmpresa';
import { IDadosEmpresaRepository } from './IDadosEmpresaRepository';

export class DadosEmpresaRepository implements IDadosEmpresaRepository {
  private obterRepositorio(): Repository<DadosEmpresa> {
    return getTenantDS().getRepository(DadosEmpresa);
  }

  buscarUnico(): Promise<DadosEmpresa | null> {
    return this.obterRepositorio().findOne({ where: {} });
  }

  async criar(dados: Partial<DadosEmpresa>): Promise<DadosEmpresa> {
    const repositorio = this.obterRepositorio();
    const registro = repositorio.create(dados);
    return repositorio.save(registro);
  }

  salvar(dados: DadosEmpresa): Promise<DadosEmpresa> {
    return this.obterRepositorio().save(dados);
  }
}
