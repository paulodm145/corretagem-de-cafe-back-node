import { Tenant } from '../entities/Tenant';
import { TenantRepository } from '../repositories/TenantRepository';

type CriarTenantDTO = {
  name: string;
  clienteId: number;
  dbName: string;
  dbHost: string;
  dbPort?: number;
  dbUsername: string;
  dbPassword: string;
  dbSsl?: boolean;
  isActive?: boolean;
};

type AtualizarTenantDTO = Partial<Omit<CriarTenantDTO, 'clienteId'>> & {
  clienteId?: number;
};

export class TenantService {
  constructor(private tenantRepository: TenantRepository) {}

  async listar(): Promise<Tenant[]> {
    return this.tenantRepository.listar();
  }

  async buscarPorId(id: number): Promise<Tenant> {
    const tenant = await this.tenantRepository.buscarPorId(id);
    if (!tenant) {
      throw new Error('Tenant não encontrado.');
    }
    return tenant;
  }

  async buscarPorToken(token: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.buscarPorToken(token);
    if (!tenant) {
      throw new Error('Tenant não encontrado.');
    }
    return tenant;
  }

  async criar(dados: CriarTenantDTO): Promise<Tenant> {
    this.validarCamposObrigatorios(dados);
    const dadosNormalizados = this.normalizarDados(dados);
    return this.tenantRepository.criar(dadosNormalizados);
  }

  async atualizar(id: number, dados: AtualizarTenantDTO): Promise<Tenant> {
    const tenant = await this.buscarPorId(id);
    const dadosCompletos = { ...tenant, ...dados };
    this.validarCamposObrigatorios(dadosCompletos);
    const dadosNormalizados = this.normalizarDados(dadosCompletos);

    tenant.name = dadosNormalizados.name;
    tenant.clienteId = dadosNormalizados.clienteId;
    tenant.dbName = dadosNormalizados.dbName;
    tenant.dbHost = dadosNormalizados.dbHost;
    tenant.dbPort = dadosNormalizados.dbPort ?? tenant.dbPort;
    tenant.dbUsername = dadosNormalizados.dbUsername;
    tenant.dbPassword = dadosNormalizados.dbPassword;
    tenant.dbSsl = dadosNormalizados.dbSsl ?? false;
    tenant.isActive = dadosNormalizados.isActive ?? tenant.isActive;

    return this.tenantRepository.salvar(tenant);
  }

  async remover(id: number): Promise<void> {
    await this.buscarPorId(id);
    await this.tenantRepository.remover(id);
  }

  private validarCamposObrigatorios(dados: Partial<CriarTenantDTO>) {
    const camposObrigatorios: Array<{ nome: string; valor: unknown }> = [
      { nome: 'name', valor: dados.name },
      { nome: 'clienteId', valor: dados.clienteId },
      { nome: 'dbName', valor: dados.dbName },
      { nome: 'dbHost', valor: dados.dbHost },
      { nome: 'dbUsername', valor: dados.dbUsername },
      { nome: 'dbPassword', valor: dados.dbPassword },
    ];

    for (const campo of camposObrigatorios) {
      const valor = campo.valor;
      if (valor === undefined || valor === null || String(valor).trim() === '') {
        throw new Error(`Campo ${campo.nome} é obrigatório.`);
      }
    }

    if (!Number.isFinite(Number(dados.clienteId))) {
      throw new Error('Campo clienteId deve ser numérico.');
    }

    if (dados.dbPort !== undefined && !Number.isFinite(Number(dados.dbPort))) {
      throw new Error('Campo dbPort deve ser numérico.');
    }
  }

  private normalizarDados(dados: CriarTenantDTO | (Tenant & AtualizarTenantDTO)): CriarTenantDTO {
    const porta = dados.dbPort !== undefined ? Number(dados.dbPort) : undefined;
    return {
      name: dados.name.trim(),
      clienteId: Number(dados.clienteId),
      dbName: dados.dbName.trim(),
      dbHost: dados.dbHost.trim(),
      dbPort: porta,
      dbUsername: dados.dbUsername.trim(),
      dbPassword: dados.dbPassword.trim(),
      dbSsl: dados.dbSsl ?? false,
      isActive: dados.isActive ?? true,
    };
  }
}
