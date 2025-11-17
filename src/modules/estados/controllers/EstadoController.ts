import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { EstadoRepository } from '../repositories/Estadorepository';
import { EstadoService } from '../services/EstadoService';

const estadoRepository = new EstadoRepository();
const service = new EstadoService(estadoRepository);

export class EstadoController {
  static async findAll(_req: Request, res: Response): Promise<Response> {
    try {
      const estados = await service.findAll();
      return res.json(estados);
    } catch (erro) {
      return responderComErroPadrao(res, erro);
    }
  }
}
