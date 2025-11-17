import { Request, Response } from 'express';
import { responderComErroPadrao } from '../../../utils/respostaErroPadrao';
import { TenantRepository } from '../repositories/TenantRepository';
import { TenantService } from '../services/TenantService';

const tenantService = new TenantService(new TenantRepository());

export class TenantController {
  listar = async (_request: Request, response: Response): Promise<Response> => {
    try {
      const tenants = await tenantService.listar();
      return response.json(tenants);
    } catch (error) {
      return responderComErroPadrao(response, error);
    }
  };

  buscarPorId = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      const tenant = await tenantService.buscarPorId(id);
      return response.json(tenant);
    } catch (error) {
      return responderComErroPadrao(response, error);
    }
  };

  criar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const novoTenant = await tenantService.criar(request.body);
      return response.status(201).json(novoTenant);
    } catch (error) {
      return responderComErroPadrao(response, error);
    }
  };

  atualizar = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      const tenantAtualizado = await tenantService.atualizar(id, request.body);
      return response.json(tenantAtualizado);
    } catch (error) {
      return responderComErroPadrao(response, error);
    }
  };

  remover = async (request: Request, response: Response): Promise<Response> => {
    try {
      const id = Number(request.params.id);
      await tenantService.remover(id);
      return response.status(204).send();
    } catch (error) {
      return responderComErroPadrao(response, error);
    }
  };
}
