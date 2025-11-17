import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  listar(): Promise<Usuario[]>;
  buscarPorId(id: number): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
  criar(dados: Partial<Usuario>): Promise<Usuario>;
  salvar(usuario: Usuario): Promise<Usuario>;
  remover(id: number): Promise<void>;
}
