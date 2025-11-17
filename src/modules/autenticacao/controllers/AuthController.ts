import { Request, Response } from 'express';
import { UsuarioRepository } from '../../usuarios/repositories/UsuarioRepository';
import { ZodError, z } from 'zod';
import { executarNoTenantPorCnpj, TenantResolverError } from '../../../tenancy/tenant-token-resolver';
import { AuthService } from '../services/AuthService';

const authService = new AuthService(new UsuarioRepository());
const tenantCnpjSchema = z.object({
  cnpj: z
    .string()
    .trim()
    .min(1, 'CNPJ é obrigatório para login.')
    .transform((valor) => valor.replace(/\D/g, ''))
    .refine((valor) => valor.length === 14, 'CNPJ inválido para login.'),
});

export class AuthController {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const cnpjInformado = typeof req.body?.cnpj === 'string' ? req.body.cnpj : '';
      const { cnpj } = tenantCnpjSchema.parse({ cnpj: cnpjInformado });

      const resultado = await executarNoTenantPorCnpj(cnpj, () => authService.autenticar(req.body));
      return res.json(resultado);
    } catch (erro) {
      if (erro instanceof ZodError) {
        const mensagem = erro.issues.map((issue) => issue.message).join(' ');
        return res.status(400).json({ mensagem });
      }
      if (erro instanceof TenantResolverError) {
        return res.status(erro.statusCode).json({ mensagem: erro.message });
      }
      if (erro instanceof Error) {
        return res.status(401).json({ mensagem: erro.message });
      }

      return res.status(500).json({ mensagem: 'Erro ao autenticar.' });
    }
  };
}
