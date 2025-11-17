import { Repository } from 'typeorm';
import { TipoObservacaoFiscal } from '../../../ENUMS/tipoObservacaoFiscal';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { ObservacaoFiscal } from '../entities/ObservacaoFiscal';
import { IObservacaoFiscalRepository } from './IObservacaoFiscalRepository';

export class ObservacaoFiscalRepository implements IObservacaoFiscalRepository {
  private obterRepositorio(): Repository<ObservacaoFiscal> {
    return getTenantDS().getRepository(ObservacaoFiscal);
  }

  listar(): Promise<ObservacaoFiscal[]> {
    return this.obterRepositorio().find({ order: { descricao: 'ASC' } });
  }

  listarPorTipo(tipo: TipoObservacaoFiscal): Promise<ObservacaoFiscal[]> {
    return this.obterRepositorio().find({ where: { tipo }, order: { descricao: 'ASC' } });
  }

  buscarPorId(id: number): Promise<ObservacaoFiscal | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async criar(dados: Partial<ObservacaoFiscal>): Promise<ObservacaoFiscal> {
    const repositorio = this.obterRepositorio();
    const entidade = repositorio.create(dados);
    return repositorio.save(entidade);
  }

  salvar(entidade: ObservacaoFiscal): Promise<ObservacaoFiscal> {
    return this.obterRepositorio().save(entidade);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
