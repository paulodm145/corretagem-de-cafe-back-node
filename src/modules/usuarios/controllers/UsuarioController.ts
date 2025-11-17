import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { UsuarioService } from '../services/UsuarioService';

const usuarioService = new UsuarioService(new UsuarioRepository());

export class UsuarioController {
  listar = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const usuarios = await usuarioService.listar();
      return res.json(usuarios);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      const usuario = await usuarioService.buscarPorId(id);
      return res.json(usuario);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const usuario = await usuarioService.criar(req.body);
      return res.status(201).json(usuario);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      const usuario = await usuarioService.atualizar(id, req.body);
      return res.json(usuario);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  remover = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      await usuarioService.remover(id);
      return res.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  private obterIdParam(param: string): number {
    const id = Number(param);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador inválido.');
    }
    return id;
  }
}
