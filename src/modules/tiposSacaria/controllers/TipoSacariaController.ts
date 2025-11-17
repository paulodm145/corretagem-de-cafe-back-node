import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { TipoSacariaRepository } from '../repositories/TipoSacariaRepository';
import { TipoSacariaService } from '../services/TipoSacariaService';

const tipoSacariaService = new TipoSacariaService(new TipoSacariaRepository());

export class TipoSacariaController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const tipos = await tipoSacariaService.listar();
      return response.json(tipos);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const tipo = await tipoSacariaService.buscarPorId(id);
      return response.json(tipo);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const criado = await tipoSacariaService.criar(request.body);
      return response.status(201).json(criado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const atualizado = await tipoSacariaService.atualizar(id, request.body);
      return response.json(atualizado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await tipoSacariaService.remover(id);
      return response.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(response, erro);
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
