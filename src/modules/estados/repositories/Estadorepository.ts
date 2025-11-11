import { Repository } from "node_modules/typeorm";
import { AppDataSource} from "src/config/data-source";
import { Estado } from "../entities/Estado";
import { IEstadoRepository } from "./IEstadoRepository";

// DTO para lista simplificada
export interface EstadoListaDTO {
  nome: string;
  sigla: string;
}

export class EstadoRepository implements IEstadoRepository {
  private repository: Repository<Estado>;

  constructor() {
    this.repository = AppDataSource.getRepository(Estado);
  }

  async findAll(): Promise<Estado[]> {
   return this.repository.find();
  }
}
