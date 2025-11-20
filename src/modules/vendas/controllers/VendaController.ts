import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { VendaRepository } from '../repositories/VendaRepository';
import { VendaService } from '../services/VendaService';

const vendaService = new VendaService(new VendaRepository());

export class VendaController {
  listar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const vendas = await vendaService.listar(request.query);
      return response.json(vendas);
    } catch (erro) {
      return responderComErroPadrao(response, erro);
    }
  };
}
