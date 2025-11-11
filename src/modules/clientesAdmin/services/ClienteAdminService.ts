import { ClienteAdmin } from "../entitities/ClienteAdmin";
import { ClienteAdminRepository } from "../repositories/ClienteAdminRepository";

export class ClienteAdminService {

    constructor(private clienteAdminRepository: ClienteAdminRepository) {}

    public async create(cliente: ClienteAdmin): Promise<ClienteAdmin> {
        return this.clienteAdminRepository.create(cliente);
    }

    public async findById(id: number): Promise<ClienteAdmin | null> {
        return this.clienteAdminRepository.findById(id);
    }

    public async update(id: number, cliente: Partial<ClienteAdmin>): Promise<ClienteAdmin | null> {
        return this.clienteAdminRepository.update(id, cliente);
    }

    public async delete(id: number): Promise<void> {
        return this.clienteAdminRepository.delete(id);
    }
    
}