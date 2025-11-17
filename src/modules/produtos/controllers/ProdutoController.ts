import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { ProdutoService } from '../services/ProdutoService';

const produtoService = new ProdutoService(new ProdutoRepository());

export class ProdutoController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const produtos = await produtoService.listar();
      return response.json(produtos);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const produto = await produtoService.buscarPorId(id);
      return response.json(produto);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const produtoCriado = await produtoService.criar(request.body);
      return response.status(201).json(produtoCriado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const produtoAtualizado = await produtoService.atualizar(id, request.body);
      return response.json(produtoAtualizado);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await produtoService.remover(id);
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
