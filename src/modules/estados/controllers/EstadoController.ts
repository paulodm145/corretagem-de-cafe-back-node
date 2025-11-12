import { Request, Response } from 'express';
import { EstadoRepository } from '../repositories/Estadorepository';
import { EstadoService } from '../services/EstadoService';

const estadoRepository = new EstadoRepository();
const service = new EstadoService(estadoRepository);

export class EstadoController {
  static async findAll(req: Request, res: Response): Promise<Response> {
    const estados = await service.findAll();
    return res.json(estados);
  }
}
