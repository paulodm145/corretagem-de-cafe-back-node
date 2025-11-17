import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { ContaBancariaRepository } from '../repositories/ContaBancariaRepository';
import { ContaBancariaService } from '../services/ContaBancariaService';

const contaBancariaService = new ContaBancariaService(new ContaBancariaRepository());

export class ContaBancariaController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const contas = await contaBancariaService.listar();
      return response.json(contas);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  listarPorCliente = async (request: Request, response: Response): Promise<Response> => {
    try {
      const clienteId = this.obterIdParam(request.params.clienteId);
      const contas = await contaBancariaService.listarPorCliente(clienteId);
      return response.json(contas);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const conta = await contaBancariaService.buscarPorId(id);
      return response.json(conta);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const conta = await contaBancariaService.criar(request.body);
      return response.status(201).json(conta);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const conta = await contaBancariaService.atualizar(id, request.body);
      return response.json(conta);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await contaBancariaService.remover(id);
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
