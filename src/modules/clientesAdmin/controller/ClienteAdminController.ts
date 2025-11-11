import { ClienteAdminService } from './../services/ClienteAdminService';
import { ClienteAdminRepository } from "../repositories/ClienteAdminRepository";
import { ClienteAdmin } from '../entitities/ClienteAdmin';

const clienteAdminrepository = new ClienteAdminRepository
const clienteAdminService = new ClienteAdminService(clienteAdminrepository);

export class ClienteAdminController {

    public async create(cliente: ClienteAdmin): Promise<ClienteAdmin> {
        return clienteAdminService.create(cliente);
    }

    public async findById(id: number): Promise<ClienteAdmin | null> {
        return clienteAdminService.findById(id);
    }

    public async update(id: number, cliente: Partial<ClienteAdmin>): Promise<ClienteAdmin | null> {
        return clienteAdminService.update(id, cliente);
    }

    public async delete(id: number): Promise<void> {
        return clienteAdminService.delete(id);
    }

}
