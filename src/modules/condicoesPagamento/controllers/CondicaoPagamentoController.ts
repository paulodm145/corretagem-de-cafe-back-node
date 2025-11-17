import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { CondicaoPagamentoRepository } from '../repositories/CondicaoPagamentoRepository';
import { CondicaoPagamentoService } from '../services/CondicaoPagamentoService';

const condicaoPagamentoService = new CondicaoPagamentoService(new CondicaoPagamentoRepository());

export class CondicaoPagamentoController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const condicoes = await condicaoPagamentoService.listar();
      return response.json(condicoes);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = condicaoPagamentoService.validarId(request.params.id);
      const condicao = await condicaoPagamentoService.buscarPorId(id);
      return response.json(condicao);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  listarPorFormaPagamento = async (request: Request, response: Response): Promise<Response> => {
    try {
      const formaPagamentoId = condicaoPagamentoService.validarId(request.params.formaPagamentoId);
      const condicoes = await condicaoPagamentoService.listarPorFormaPagamento(formaPagamentoId);
      return response.json(condicoes);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const condicao = await condicaoPagamentoService.criar(request.body);
      return response.status(201).json(condicao);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = condicaoPagamentoService.validarId(request.params.id);
      const condicao = await condicaoPagamentoService.atualizar(id, request.body);
      return response.json(condicao);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = condicaoPagamentoService.validarId(request.params.id);
      await condicaoPagamentoService.remover(id);
      return response.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };
}
