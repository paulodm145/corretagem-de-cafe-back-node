import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { calcularTotalPaginas, ListaPaginada, ParametrosListagem } from '../../../utils/paginacao';
import { Cliente } from '../entities/Cliente';
import { IClienteRepository } from './IClienteRepository';

const CAMPOS_ORDENACAO: Record<string, string> = {
  nome: 'cliente.nome',
  documento: 'cliente.documento',
  createdAt: 'cliente.created_at',
};

export class ClienteRepository implements IClienteRepository {
  private obterRepositorio(): Repository<Cliente> {
    return getTenantDS().getRepository(Cliente);
  }

  async listar(parametros: ParametrosListagem): Promise<ListaPaginada<Cliente>> {
    const repositorio = this.obterRepositorio();
    const consulta = repositorio.createQueryBuilder('cliente');

    if (parametros.busca) {
      const texto = `%${parametros.busca}%`;
      consulta.where('(cliente.nome ILIKE :texto OR cliente.cidade ILIKE :texto)', { texto });
      const documentoBusca = parametros.busca.replace(/\D/g, '');
      if (documentoBusca) {
        consulta.orWhere('cliente.documento LIKE :documento', { documento: `%${documentoBusca}%` });
      } else {
        consulta.orWhere('cliente.documento ILIKE :texto', { texto });
      }
    }

    const campoOrdenacao = CAMPOS_ORDENACAO[parametros.ordenarPor] ?? CAMPOS_ORDENACAO.nome;

    consulta
      .orderBy(campoOrdenacao, parametros.ordenacao)
      .skip((parametros.pagina - 1) * parametros.limite)
      .take(parametros.limite);

    const [dados, total] = await consulta.getManyAndCount();

    return {
      dados,
      pagina: parametros.pagina,
      limite: parametros.limite,
      total,
      totalPaginas: calcularTotalPaginas(total, parametros.limite),
    };
  }

  async buscarPorId(id: number): Promise<Cliente | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  async buscarPorDocumento(documento: string): Promise<Cliente | null> {
    return this.obterRepositorio().findOne({ where: { documento } });
  }

  async criar(dados: Partial<Cliente>): Promise<Cliente> {
    const repositorio = this.obterRepositorio();
    const cliente = repositorio.create(dados);
    return repositorio.save(cliente);
  }

  async salvar(cliente: Cliente): Promise<Cliente> {
    return this.obterRepositorio().save(cliente);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
