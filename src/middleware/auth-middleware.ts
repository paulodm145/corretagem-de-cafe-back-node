import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { authConfig } from '../config/auth-config';
import { getCurrentTenant } from '../tenancy/tenant-context';

interface TokenPayload extends JwtPayload {
  sub: string;
  usuarioId: number;
  email: string;
  nome: string;
  tenantToken: string;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' ');

  if (!token) {
    return res.status(401).json({ mensagem: 'Token não informado.' });
  }

  try {
    const payload = jwt.verify(token, authConfig.segredo) as TokenPayload;
    const tenant = getCurrentTenant();

    if (payload.tenantToken !== tenant.token) {
      return res.status(401).json({ mensagem: 'Token não corresponde ao tenant informado.' });
    }

    const usuarioId = Number(payload.usuarioId);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return res.status(401).json({ mensagem: 'Token de usuário inválido.' });
    }

    req.usuarioAutenticado = {
      id: usuarioId,
      email: payload.email,
      nome: payload.nome,
    };

    return next();
  } catch (erro) {
    console.error('Erro ao validar token JWT:', erro);
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
  }
}
