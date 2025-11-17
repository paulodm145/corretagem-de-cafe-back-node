import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { FormaPagamentoRepository } from '../repositories/FormaPagamentoRepository';
import { FormaPagamentoService } from '../services/FormaPagamentoService';

const formaPagamentoService = new FormaPagamentoService(new FormaPagamentoRepository());

export class FormaPagamentoController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const formas = await formaPagamentoService.listar();
      return response.json(formas);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = formaPagamentoService.validarId(request.params.id);
      const forma = await formaPagamentoService.buscarPorId(id);
      return response.json(forma);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const forma = await formaPagamentoService.criar(request.body);
      return response.status(201).json(forma);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = formaPagamentoService.validarId(request.params.id);
      const forma = await formaPagamentoService.atualizar(id, request.body);
      return response.json(forma);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = formaPagamentoService.validarId(request.params.id);
      await formaPagamentoService.remover(id);
      return response.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };
}
