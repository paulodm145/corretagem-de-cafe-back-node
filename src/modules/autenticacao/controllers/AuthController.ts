import { Request, Response } from 'express';
import { z } from 'zod';
import { UsuarioRepository } from '../../usuarios/repositories/UsuarioRepository';
import { executarNoTenantPorCnpj } from '../../../tenancy/tenant-token-resolver';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
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
      return responderComErroPadrao(res, erro);
    }
  };
}
