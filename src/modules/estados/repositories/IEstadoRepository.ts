import { Estado } from '../entities/Estado';

export interface IEstadoRepository {
  findAll(): Promise<Estado[]>;
}
