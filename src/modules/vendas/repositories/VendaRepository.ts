import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { calcularTotalPaginas, ListaPaginada, ParametrosListagem } from '../../../utils/paginacao';
import { Venda } from '../entities/Venda';
import { IVendaRepository } from './IVendaRepository';

const CAMPOS_ORDENACAO: Record<string, string> = {
  dataVenda: 'venda.data_venda',
  numeroContrato: 'venda.numero_contrato',
  status: 'venda.status',
  createdAt: 'venda.created_at',
  clienteNome: 'cliente.nome',
};

export class VendaRepository implements IVendaRepository {
  private obterRepositorio(): Repository<Venda> {
    return getTenantDS().getRepository(Venda);
  }

  async listar(parametros: ParametrosListagem): Promise<ListaPaginada<Venda>> {
    const repositorio = this.obterRepositorio();
    const consulta = repositorio
      .createQueryBuilder('venda')
      .leftJoin('venda.cliente', 'cliente')
      .addSelect(['cliente.id', 'cliente.nome']);

    if (parametros.busca) {
      const texto = `%${parametros.busca}%`;
      consulta.where('venda.numero_contrato ILIKE :texto OR venda.status ILIKE :texto', { texto });
      consulta.orWhere('cliente.nome ILIKE :texto', { texto });
    }

    const campoOrdenacao = CAMPOS_ORDENACAO[parametros.ordenarPor] ?? CAMPOS_ORDENACAO.dataVenda;

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
}
