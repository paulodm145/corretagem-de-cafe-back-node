import { Request, Response } from 'express';
import { TipoSacariaRepository } from '../repositories/TipoSacariaRepository';
import { TipoSacariaService } from '../services/TipoSacariaService';

const tipoSacariaService = new TipoSacariaService(new TipoSacariaRepository());

export class TipoSacariaController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const tipos = await tipoSacariaService.listar();
      return response.json(tipos);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const tipo = await tipoSacariaService.buscarPorId(id);
      return response.json(tipo);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const criado = await tipoSacariaService.criar(request.body);
      return response.status(201).json(criado);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      const atualizado = await tipoSacariaService.atualizar(id, request.body);
      return response.json(atualizado);
    } catch (erro) {
      return this.responderErro(response, erro);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(request.params.id);
      await tipoSacariaService.remover(id);
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

    return response.status(500).json({ mensagem: 'Erro interno ao processar a requisição.' });
  }

  private obterIdParam(param: string): number {
    const id = Number(param);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Identificador inválido.');
    }
    return id;
  }
}
