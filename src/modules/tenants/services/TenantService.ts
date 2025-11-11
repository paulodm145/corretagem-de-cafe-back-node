import { Tenant } from '../entities/Tenant';
import { TenantRepository } from '../repositories/TenantRepository';

type CriarTenantDTO = {
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string | null;
  emailContato?: string | null;
  telefoneContato?: string | null;
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

type DadosTenantNormalizados = {
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string | null;
  emailContato: string | null;
  telefoneContato: string | null;
  clienteId: number;
  dbName: string;
  dbHost: string;
  dbPort?: number;
  dbUsername: string;
  dbPassword: string;
  dbSsl: boolean;
  isActive: boolean;
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
    tenant.razaoSocial = dadosNormalizados.razaoSocial;
    tenant.nomeFantasia = dadosNormalizados.nomeFantasia;
    tenant.cnpj = dadosNormalizados.cnpj;
    tenant.inscricaoEstadual = dadosNormalizados.inscricaoEstadual;
    tenant.emailContato = dadosNormalizados.emailContato;
    tenant.telefoneContato = dadosNormalizados.telefoneContato;
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
      { nome: 'razaoSocial', valor: dados.razaoSocial },
      { nome: 'nomeFantasia', valor: dados.nomeFantasia },
      { nome: 'cnpj', valor: dados.cnpj },
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

    this.validarFormatoCnpj(dados.cnpj);
    this.validarEmailSeInformado(dados.emailContato);
    this.validarTelefoneSeInformado(dados.telefoneContato);
  }

  private normalizarDados(dados: CriarTenantDTO | (Tenant & AtualizarTenantDTO)): DadosTenantNormalizados {
    const porta = dados.dbPort !== undefined ? Number(dados.dbPort) : undefined;
    const cnpjNumerico = this.removerNaoNumericos(String(dados.cnpj));
    const inscricaoEstadual = dados.inscricaoEstadual?.trim() || null;
    const emailContato = dados.emailContato?.trim().toLowerCase() || null;
    const telefoneContato = dados.telefoneContato?.trim() || null;

    return {
      name: dados.name.trim(),
      razaoSocial: dados.razaoSocial.trim(),
      nomeFantasia: dados.nomeFantasia.trim(),
      cnpj: cnpjNumerico,
      inscricaoEstadual,
      emailContato,
      telefoneContato,
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

  private validarFormatoCnpj(cnpj?: string | null) {
    if (cnpj === undefined || cnpj === null) {
      throw new Error('Campo cnpj é obrigatório.');
    }

    const somenteNumeros = this.removerNaoNumericos(String(cnpj));
    if (somenteNumeros.length !== 14) {
      throw new Error('Campo cnpj deve conter 14 dígitos.');
    }
  }

  private validarEmailSeInformado(email?: string | null) {
    if (!email) {
      return;
    }

    const emailNormalizado = email.trim();
    const formatoEmailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmailValido.test(emailNormalizado)) {
      throw new Error('Campo emailContato deve conter um e-mail válido.');
    }
  }

  private validarTelefoneSeInformado(telefone?: string | null) {
    if (!telefone) {
      return;
    }

    const apenasNumeros = this.removerNaoNumericos(telefone);
    if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
      throw new Error('Campo telefoneContato deve conter entre 10 e 11 dígitos.');
    }
  }

  private removerNaoNumericos(valor: string): string {
    return valor.replace(/\D/g, '');
  }
}
