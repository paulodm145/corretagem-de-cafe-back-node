import { Repository } from 'typeorm';
import { getTenantDS } from '../../../tenancy/tenant-context';
import { Usuario } from '../entities/Usuario';
import { IUsuarioRepository } from './IUsuarioRepository';

export class UsuarioRepository implements IUsuarioRepository {
  private obterRepositorio(): Repository<Usuario> {
    return getTenantDS().getRepository(Usuario);
  }

  listar(): Promise<Usuario[]> {
    return this.obterRepositorio().find({ order: { nome: 'ASC' } });
  }

  buscarPorId(id: number): Promise<Usuario | null> {
    return this.obterRepositorio().findOne({ where: { id } });
  }

  buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.obterRepositorio().findOne({ where: { email } });
  }

  async criar(dados: Partial<Usuario>): Promise<Usuario> {
    const repositorio = this.obterRepositorio();
    const usuario = repositorio.create(dados);
    return repositorio.save(usuario);
  }

  salvar(usuario: Usuario): Promise<Usuario> {
    return this.obterRepositorio().save(usuario);
  }

  async remover(id: number): Promise<void> {
    await this.obterRepositorio().delete(id);
  }
}
