import { Request, Response } from 'express';
import { ProdutoRepository } from '../repositories/ProdutoRepository';
import { ProdutoService } from '../services/ProdutoService';

const produtoService = new ProdutoService(new ProdutoRepository());

export class ProdutoController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const produtos = await produtoService.listar();
      return response.json(produtos);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { id } = request.params;
      const produto = await produtoService.buscarPorId(id);
      return response.json(produto);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { descricao } = request.body ?? {};
      const produtoCriado = await produtoService.criar({ descricao });
      return response.status(201).json(produtoCriado);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { id } = request.params;
      const { descricao } = request.body ?? {};
      const produtoAtualizado = await produtoService.atualizar(id, { descricao });
      return response.json(produtoAtualizado);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const { id } = request.params;
      await produtoService.remover(id);
      return response.status(204).send();
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  private responderErro(response: Response, erro: unknown): Response {
    if (erro instanceof Error && erro.message.includes('não encontrado')) {
      return response.status(404).json({ mensagem: erro.message });
    }

    if (erro instanceof Error) {
      return response.status(400).json({ mensagem: erro.message });
    }

    return response
      .status(500)
      .json({ mensagem: 'Erro interno ao processar a requisição.' });
  }
}
