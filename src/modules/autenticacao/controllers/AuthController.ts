import { Request, Response } from 'express';
import { UsuarioRepository } from '../../usuarios/repositories/UsuarioRepository';
import { ZodError, z } from 'zod';
import { executarNoTenantPorToken, TenantTokenError } from '../../../tenancy/tenant-token-resolver';
import { AuthService } from '../services/AuthService';

const authService = new AuthService(new UsuarioRepository());
const tenantTokenSchema = z.object({
  tenantToken: z
    .string()
    .trim()
    .min(1, 'Token do tenant é obrigatório para login.')
    .uuid('Token do tenant inválido.'),
});

export class AuthController {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const tokenInformado =
        (typeof req.body?.tenantToken === 'string' && req.body.tenantToken) ||
        req.header('x-tenant-token') ||
        '';
      const { tenantToken } = tenantTokenSchema.parse({ tenantToken: tokenInformado });

      const resultado = await executarNoTenantPorToken(tenantToken, () => authService.autenticar(req.body));
      return res.json(resultado);
    } catch (erro) {
      if (erro instanceof ZodError) {
        const mensagem = erro.issues.map((issue) => issue.message).join(' ');
        return res.status(400).json({ mensagem });
      }
      if (erro instanceof TenantTokenError) {
        return res.status(erro.statusCode).json({ mensagem: erro.message });
      }
      if (erro instanceof Error) {
        return res.status(401).json({ mensagem: erro.message });
      }

      return res.status(500).json({ mensagem: 'Erro ao autenticar.' });
    }
  };
}
