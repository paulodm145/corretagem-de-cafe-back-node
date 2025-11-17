import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { LocalDescargaRepository } from '../repositories/LocalDescargaRepository';
import { LocalDescargaService } from '../services/LocalDescargaService';

const localDescargaService = new LocalDescargaService(new LocalDescargaRepository());

export class LocalDescargaController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const locais = await localDescargaService.listar();
      return response.json(locais);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const local = await localDescargaService.buscarPorId(id);
      return response.json(local);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  listarPorCliente = async (request: Request, response: Response): Promise<Response> => {
    try {
      const clienteId = this.obterIdParam(request.params.clienteId);
      const locais = await localDescargaService.listarPorCliente(clienteId);
      return response.json(locais);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const local = await localDescargaService.criar(request.body);
      return response.status(201).json(local);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const local = await localDescargaService.atualizar(id, request.body);
      return response.json(local);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await localDescargaService.remover(id);
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
