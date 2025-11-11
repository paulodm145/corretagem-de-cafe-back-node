import { Request, Response } from "node_modules/@types/express";
import { CidadeRepository } from "src/modules/cidades/repositories/CidadeRepository";
import { CidadeService } from "../services/CidadeService";

const cidadeRepository = new CidadeRepository();
const service = new CidadeService(cidadeRepository);

export class CidadeController {
    static async findByUf(req: Request, res: Response): Promise<Response> {
        const { uf } = req.params;
        const cidades = await service.findByUf(uf);
        return res.json(cidades);
    }
}



// import { EstadoRepository } from "../repositories/Estadorepository";
// import { EstadoService } from "../services/EstadoService";

// const estadoRepository = new EstadoRepository();
// const service = new EstadoService(estadoRepository);

// export class EstadoController {
//   static async findAll(req: Request, res: Response): Promise<Response> {
//     const estados = await service.findAll();
//     return res.json(estados);
//   }
// }