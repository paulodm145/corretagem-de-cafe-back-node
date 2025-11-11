import { Cidade } from "../entities/Cidade";
import { ICidadeRepository } from "../repositories/ICidadeRepository";
import { cidadeDTO } from "../dto/cidadeDTO";

export class CidadeService {
    constructor(private cidadeRepository: ICidadeRepository) {}

    async findByUf(uf: string): Promise<cidadeDTO> {
        const cidades =  this.cidadeRepository.findByUf(uf);
        return (await cidades).map(cidade => ({
            id: cidade.id,
            nome: cidade.nome,
            estado_id: cidade.estadoId
        })) as unknown as cidadeDTO;
    }
}
