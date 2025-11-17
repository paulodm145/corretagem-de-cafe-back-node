import jwt from 'jsonwebtoken';
import { ZodError, z } from 'zod';
import { authConfig } from '../../../config/auth-config';
import { getCurrentTenant } from '../../../tenancy/tenant-context';
import { compararSenha } from '../../../utils/criptografia-senha';
import { Usuario } from '../../usuarios/entities/Usuario';
import { IUsuarioRepository } from '../../usuarios/repositories/IUsuarioRepository';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido.'),
  senha: z.string().min(1, 'Senha é obrigatória.'),
});

type LoginPayload = z.infer<typeof loginSchema>;

export class AuthService {
  constructor(private readonly usuarioRepository: IUsuarioRepository) {}

  async autenticar(payload: unknown): Promise<{ token: string; usuario: Pick<Usuario, 'id' | 'nome' | 'email'> }> {
    let dados: LoginPayload;

    try {
      dados = loginSchema.parse(payload);
    } catch (erro) {
      if (erro instanceof ZodError) {
        const mensagem = erro.issues.map((issue) => issue.message).join(' ');
        throw new Error(mensagem);
      }
      throw erro;
    }

    const usuario = await this.usuarioRepository.buscarPorEmail(dados.email);

    if (!usuario || !usuario.ativo) {
      throw new Error('Credenciais inválidas.');
    }

    const senhaValida = compararSenha({ senha: dados.senha, hashArmazenado: usuario.senhaHash });

    if (!senhaValida) {
      throw new Error('Credenciais inválidas.');
    }

    const tenant = getCurrentTenant();
    const token = jwt.sign(
      {
        sub: String(usuario.id),
        usuarioId: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tenantToken: tenant.token,
      },
      authConfig.segredo,
      { expiresIn: authConfig.expiresIn }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    };
  }
}
