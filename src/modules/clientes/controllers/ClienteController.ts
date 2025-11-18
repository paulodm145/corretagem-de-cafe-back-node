import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { ClienteService } from '../services/ClienteService';

const clienteService = new ClienteService(new ClienteRepository());

export class ClienteController {
  listar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const clientes = await clienteService.listar(request.query);
      return response.json(clientes);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const cliente = await clienteService.buscarPorId(id);
      return response.json(cliente);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const cliente = await clienteService.criar(request.body);
      return response.status(201).json(cliente);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const cliente = await clienteService.atualizar(id, request.body);
      return response.json(cliente);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await clienteService.remover(id);
      return response.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizarStatus = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const cliente = await clienteService.atualizarStatus(id, request.body);
      return response.json(cliente);
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
