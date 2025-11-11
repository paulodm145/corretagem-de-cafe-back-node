import { Repository } from "node_modules/typeorm";
;
import { AppDataSource } from "src/config/data-source";
import { ClienteAdmin } from "../entitities/ClienteAdmin";

export class ClienteAdminRepository {

    private repository: Repository<ClienteAdmin>;
    
      constructor() {
        this.repository = AppDataSource.getRepository(ClienteAdmin);
      }

      public async create(cliente: ClienteAdmin): Promise<ClienteAdmin> {
        return this.repository.save(cliente);
      }

      public async findById(id: number): Promise<ClienteAdmin | null> {
        return this.repository.findOneBy({ id });
      }

      public async update(id: number, cliente: Partial<ClienteAdmin>): Promise<ClienteAdmin | null> {
        await this.repository.update(id, cliente);
        return this.findById(id);
      }

      public async delete(id: number): Promise<void> {
        await this.repository.delete(id);
      }

}