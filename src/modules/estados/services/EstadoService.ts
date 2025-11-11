import { Estado } from "../entities/Estado";
import { IEstadoRepository } from "../repositories/IEstadoRepository";

export class EstadoService {
  constructor(private estadoRepository: IEstadoRepository) {}

  async findAll(): Promise<Estado[]> {
    return this.estadoRepository.findAll();
  }

}
