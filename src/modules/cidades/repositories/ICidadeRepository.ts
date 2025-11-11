import { Cidade } from "../entities/Cidade";

export interface ICidadeRepository {
    findByUf(uf: string): Promise<Cidade[]>;
}




// import { Estado } from '../entities/Estado';

// export interface IEstadoRepository {
//   findAll(): Promise<Estado[]>;
// }