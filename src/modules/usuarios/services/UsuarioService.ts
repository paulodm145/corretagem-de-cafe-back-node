import { ZodError } from 'zod';
import { gerarHashSenha } from '../../../utils/criptografia-senha';
import { Usuario } from '../entities/Usuario';
import { IUsuarioRepository } from '../repositories/IUsuarioRepository';
import { atualizarUsuarioSchema, criarUsuarioSchema } from '../validators/usuarioSchemas';

export class UsuarioService {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  listar(): Promise<Usuario[]> {
    return this.usuarioRepository.listar();
  }

  async buscarPorId(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado.');
    }
    return usuario;
  }

  async criar(payload: unknown): Promise<Usuario> {
    try {
      const dados = criarUsuarioSchema.parse(payload);
      await this.garantirEmailUnico(dados.email);
      const senhaHash = gerarHashSenha(dados.senha);
      return this.usuarioRepository.criar({
        nome: dados.nome,
        email: dados.email,
        senhaHash,
        ativo: dados.ativo,
      });
    } catch (erro) {
      this.lancarErroValidacao(erro);
    }
  }

  async atualizar(id: number, payload: unknown): Promise<Usuario> {
    try {
      const dados = atualizarUsuarioSchema.parse(payload);
      const usuario = await this.buscarPorId(id);

      if (dados.email && dados.email !== usuario.email) {
        await this.garantirEmailUnico(dados.email);
        usuario.email = dados.email;
      }

      if (dados.nome) {
        usuario.nome = dados.nome;
      }

      if (typeof dados.ativo === 'boolean') {
        usuario.ativo = dados.ativo;
      }

      if (dados.senha) {
        usuario.senhaHash = gerarHashSenha(dados.senha);
      }

      return this.usuarioRepository.salvar(usuario);
    } catch (erro) {
      this.lancarErroValidacao(erro);
    }
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.usuarioRepository.remover(id);
  }

  private async garantirEmailUnico(email: string): Promise<void> {
    const existente = await this.usuarioRepository.buscarPorEmail(email);
    if (existente) {
      throw new Error('Já existe um usuário com este e-mail.');
    }
  }

  private lancarErroValidacao(erro: unknown): never {
    if (erro instanceof ZodError) {
      const mensagem = erro.issues.map((issue) => issue.message).join(' ');
      throw new Error(mensagem);
    }

    throw erro instanceof Error ? erro : new Error('Dados inválidos.');
  }
}
