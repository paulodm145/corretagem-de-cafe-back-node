import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { ObservacaoFiscalRepository } from '../repositories/ObservacaoFiscalRepository';
import { ObservacaoFiscalService } from '../services/ObservacaoFiscalService';

const observacaoFiscalService = new ObservacaoFiscalService(new ObservacaoFiscalRepository());

export class ObservacaoFiscalController {
  listar = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const observacoes = await observacaoFiscalService.listar();
      return res.json(observacoes);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  listarPorTipo = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tipo } = req.params;
      const observacoes = await observacaoFiscalService.listarPorTipo(tipo);
      return res.json(observacoes);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  buscarPorId = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      const observacao = await observacaoFiscalService.buscarPorId(id);
      return res.json(observacao);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  criar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const criado = await observacaoFiscalService.criar(req.body);
      return res.status(201).json(criado);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  atualizar = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      const atualizado = await observacaoFiscalService.atualizar(id, req.body);
      return res.json(atualizado);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  };

  remover = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = this.obterIdParam(req.params.id);
      await observacaoFiscalService.remover(id);
      return res.status(204).send();
    } catch (erro) {
      return responderComErroPadrao(res, erro);
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
