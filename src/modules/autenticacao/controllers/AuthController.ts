import { Request, Response } from 'express';
import { UsuarioRepository } from '../../usuarios/repositories/UsuarioRepository';
import { AuthService } from '../services/AuthService';

const authService = new AuthService(new UsuarioRepository());

export class AuthController {
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const resultado = await authService.autenticar(req.body);
      return res.json(resultado);
    } catch (erro) {
      if (erro instanceof Error) {
        return res.status(401).json({ mensagem: erro.message });
      }

      return res.status(500).json({ mensagem: 'Erro ao autenticar.' });
    }
  };
}
