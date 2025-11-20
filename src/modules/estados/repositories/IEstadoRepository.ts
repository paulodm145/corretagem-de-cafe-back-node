import { Estado } from '../entities/Estado';

export interface IEstadoRepository {
  findAll(): Promise<Estado[]>;
  findById(id: number): Promise<Estado | null>;
}
