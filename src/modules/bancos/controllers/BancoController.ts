import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { BancoRepository } from '../repositories/BancoRepository';
import { BancoService } from '../services/BancoService';

const bancoService = new BancoService(new BancoRepository());

export class BancoController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const bancos = await bancoService.listar();
      return response.json(bancos);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const banco = await bancoService.buscarPorId(id);
      return response.json(banco);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const bancoCriado = await bancoService.criar(request.body);
      return response.status(201).json(bancoCriado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const bancoAtualizado = await bancoService.atualizar(id, request.body);
      return response.json(bancoAtualizado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await bancoService.remover(id);
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
