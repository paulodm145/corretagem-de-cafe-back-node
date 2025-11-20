import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { DadosEmpresaRepository } from '../repositories/DadosEmpresaRepository';
import { DadosEmpresaService } from '../services/DadosEmpresaService';

const dadosEmpresaService = new DadosEmpresaService(new DadosEmpresaRepository());

export class DadosEmpresaController {
  obter = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const dados = await dadosEmpresaService.obter();
      return response.json(dados);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const dadosAtualizados = await dadosEmpresaService.atualizar(request.body);
      return response.json(dadosAtualizados);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };
}
