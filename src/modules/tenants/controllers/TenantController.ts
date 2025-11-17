import { Request, Response } from 'express';
import { TenantRepository } from '../repositories/TenantRepository';
import { TenantService } from '../services/TenantService';

const tenantService = new TenantService(new TenantRepository());

export class TenantController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const tenants = await tenantService.listar();
      return response.json(tenants);
    } catch (error) {
      return this.responderErro(response, error);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      const tenant = await tenantService.buscarPorId(id);
      return response.json(tenant);
    } catch (error) {
      return this.responderErro(response, error);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const novoTenant = await tenantService.criar(request.body);
      return response.status(201).json(novoTenant);
    } catch (error) {
      return this.responderErro(response, error);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      const tenantAtualizado = await tenantService.atualizar(id, request.body);
      return response.json(tenantAtualizado);
    } catch (error) {
      return this.responderErro(response, error);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      await tenantService.remover(id);
      return response.status(204).send();
    } catch (error) {
      return this.responderErro(response, error);
    }
  };

  private responderErro(response: Response, error: unknown): Response {
    if (error instanceof Error && error.message.includes('não encontrado')) {
      return response.status(404).json({ mensagem: error.message, line: error.stack, file: __filename });
    }

    if (error instanceof Error) {
      return response.status(400).json({ mensagem: error.message, line: error.stack, file: __filename });
    }

    return response.status(500).json({ mensagem: error.message, line: error.stack, file: __filename });
  }
}
