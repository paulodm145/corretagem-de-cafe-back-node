import { Cidade } from "../entities/Cidade";

export interface ICidadeRepository {
    buscarPorId(id: number): Promise<Cidade | null>;
    findByUf(uf: string): Promise<Cidade[]>;
}




// import { Estado } from '../entities/Estado';

// export interface IEstadoRepository {
//   findAll(): Promise<Estado[]>;
// }