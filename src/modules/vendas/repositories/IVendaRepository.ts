import { ListaPaginada, ParametrosListagem } from '../../../utils/paginacao';
import { Venda } from '../entities/Venda';

export interface IVendaRepository {
  listar(parametros: ParametrosListagem): Promise<ListaPaginada<Venda>>;
}
