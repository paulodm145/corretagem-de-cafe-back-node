import { Repository } from "node_modules/typeorm";
import { AppDataSource} from "src/config/data-source";
import { Cidade } from "../entities/Cidade";
import { ICidadeRepository } from "./ICidadeRepository";

export class CidadeRepository implements ICidadeRepository {
  private repository: Repository<Cidade>;

  constructor() {
    this.repository = AppDataSource.getRepository(Cidade);
  }

  async findByUf(uf: string): Promise<Cidade[]> {

    const sigla = uf.toUpperCase();

    return this.repository
      .createQueryBuilder('c')
      .leftJoin('c.estado', 'e')
      .where('e.sigla = :uf', { uf: sigla })
      .getMany();
  }
}
