import { ContaBancaria } from '../entities/ContaBancaria';

export interface IContaBancariaRepository {
  listar(): Promise<ContaBancaria[]>;
  listarPorCliente(clienteId: number): Promise<ContaBancaria[]>;
  buscarPorId(id: number): Promise<ContaBancaria | null>;
  criar(dados: Partial<ContaBancaria>): Promise<ContaBancaria>;
  salvar(conta: ContaBancaria): Promise<ContaBancaria>;
  remover(id: number): Promise<void>;
}
