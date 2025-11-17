import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { CidadeRepository } from '../repositories/CidadeRepository';
import { CidadeService } from '../services/CidadeService';

const cidadeRepository = new CidadeRepository();
const service = new CidadeService(cidadeRepository);

export class CidadeController {
  static async findByUf(req: Request, res: Response): Promise<Response> {
    try {
      const { uf } = req.params;
      const cidades = await service.findByUf(uf);
      return res.json(cidades);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  }
}