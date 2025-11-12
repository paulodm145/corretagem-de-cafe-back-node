import path from 'node:path';
import { DataSource, QueryRunner } from 'typeorm';
import { MasterDataSource } from '../../../config/master-data-source';
import { gerarSenhaSegura } from '../../../utils/gerador-senha';
import { tenantDSManager, ENTIDADES_TENANT_GLOB, MIGRACOES_TENANT_GLOB } from '../../../tenancy/TenantDataSourceManager';
import { Cidade } from '../../cidades/entities/Cidade';
import { Estado } from '../../estados/entities/Estado';
import { importarDadosIbgeNoDataSource } from '../../ibge/importador-ibge';
import { Tenant } from '../entities/Tenant';
import { TenantRepository } from '../repositories/TenantRepository';

const TAMANHO_MAXIMO_IDENTIFICADOR = 63; // limite do PostgreSQL

const CAMINHO_ENTIDADES = ENTIDADES_TENANT_GLOB || path.join(__dirname, '..', '..', '..', 'modules', '**', 'entities', '*.{ts,js}');
const CAMINHO_MIGRACOES = MIGRACOES_TENANT_GLOB || path.join(__dirname, '..', '..', '..', 'database', 'migrations', '*.{ts,js}');

type CriarTenantDTO = {
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string | null;
  emailContato?: string | null;
  telefoneContato?: string | null;
  clienteId: number;
  dbHost?: string;
  dbPort?: number;
  dbSsl?: boolean;
  isActive?: boolean;
};

type AtualizarTenantDTO = Partial<CriarTenantDTO>;

type DadosTenantNormalizados = {
  name: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string | null;
  emailContato: string | null;
  telefoneContato: string | null;
  clienteId: number;
  dbHost: string;
  dbPort: number;
  dbSsl: boolean;
  isActive: boolean;
};

type ConfiguracaoBancoTenant = {
  dbName: string;
  dbUsername: string;
  dbPassword: string;
};

type DetalhesCompletosBanco = ConfiguracaoBancoTenant & {
  dbHost: string;
  dbPort: number;
  dbSsl: boolean;
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
    const configuracaoBanco = this.gerarConfiguracaoBanco(dadosNormalizados);

    await this.provisionarBanco(configuracaoBanco);

    const tenantCriado = await this.tenantRepository.criar({
      ...dadosNormalizados,
      ...configuracaoBanco,
    });

    await this.prepararEstruturaTenant(tenantCriado, configuracaoBanco);

    return tenantCriado;
  }

  async atualizar(id: number, dados: AtualizarTenantDTO): Promise<Tenant> {
    const tenant = await this.buscarPorId(id);
    const dadosCompletos: CriarTenantDTO = {
      name: tenant.name,
      razaoSocial: tenant.razaoSocial,
      nomeFantasia: tenant.nomeFantasia,
      cnpj: tenant.cnpj,
      inscricaoEstadual: tenant.inscricaoEstadual,
      emailContato: tenant.emailContato,
      telefoneContato: tenant.telefoneContato,
      clienteId: tenant.clienteId,
      dbHost: tenant.dbHost,
      dbPort: tenant.dbPort,
      dbSsl: tenant.dbSsl,
      isActive: tenant.isActive,
      ...dados,
    };

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
    tenant.dbHost = dadosNormalizados.dbHost;
    tenant.dbPort = dadosNormalizados.dbPort;
    tenant.dbSsl = dadosNormalizados.dbSsl;
    tenant.isActive = dadosNormalizados.isActive;

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

    this.validarFormatoCnpj(dados.cnpj);
    this.validarEmailSeInformado(dados.emailContato);
    this.validarTelefoneSeInformado(dados.telefoneContato);
  }

  private normalizarDados(dados: CriarTenantDTO | (Tenant & AtualizarTenantDTO)): DadosTenantNormalizados {
    const cnpjNumerico = this.removerNaoNumericos(String(dados.cnpj));
    const inscricaoEstadual = dados.inscricaoEstadual?.trim() || null;
    const emailContato = dados.emailContato?.trim().toLowerCase() || null;
    const telefoneContato = dados.telefoneContato?.trim() || null;

    const hostPadrao = this.obterHostPadrao(dados.dbHost);
    const portaPadrao = this.obterPortaPadrao(dados.dbPort);
    const sslPadrao = this.obterSslPadrao(dados.dbSsl);

    return {
      name: dados.name.trim(),
      razaoSocial: dados.razaoSocial.trim(),
      nomeFantasia: dados.nomeFantasia.trim(),
      cnpj: cnpjNumerico,
      inscricaoEstadual,
      emailContato,
      telefoneContato,
      clienteId: Number(dados.clienteId),
      dbHost: hostPadrao,
      dbPort: portaPadrao,
      dbSsl: sslPadrao,
      isActive: dados.isActive ?? true,
    };
  }

  private gerarConfiguracaoBanco(dados: DadosTenantNormalizados): DetalhesCompletosBanco {
    const slugBase = this.gerarSlug(dados.nomeFantasia || dados.name);
    const nomeBanco = this.gerarNomeBanco(slugBase, dados.cnpj);
    const usuarioBanco = this.gerarNomeUsuarioBanco(slugBase);
    const senhaBanco = gerarSenhaSegura();

    return {
      dbName: nomeBanco,
      dbUsername: usuarioBanco,
      dbPassword: senhaBanco,
      dbHost: dados.dbHost,
      dbPort: dados.dbPort,
      dbSsl: dados.dbSsl,
    };
  }

  private gerarSlug(texto: string): string {
    const normalizado = texto
      .normalize('NFD')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const apenasPermitidos = normalizado.replace(/[^a-z0-9]+/g, '_');
    const semUnderscoreInicioFim = apenasPermitidos.replace(/^_+|_+$/g, '');

    if (!semUnderscoreInicioFim) {
      return 'tenant';
    }

    return semUnderscoreInicioFim.substring(0, 30);
  }

  private gerarNomeBanco(slug: string, cnpj: string): string {
    const base = `${slug}_${cnpj}`.toLowerCase();
    if (base.length <= TAMANHO_MAXIMO_IDENTIFICADOR) {
      return base;
    }

    const excesso = base.length - TAMANHO_MAXIMO_IDENTIFICADOR;
    const slugAjustado = slug.substring(0, Math.max(1, slug.length - excesso));
    const nomeAjustado = `${slugAjustado}_${cnpj}`.toLowerCase();
    return nomeAjustado.substring(0, TAMANHO_MAXIMO_IDENTIFICADOR);
  }

  private gerarNomeUsuarioBanco(slug: string): string {
    const sufixoAleatorio = Math.random().toString(36).substring(2, 8);
    const base = `usr_${slug}_${sufixoAleatorio}`.toLowerCase();
    return base.substring(0, Math.min(base.length, 30));
  }

  private obterHostPadrao(hostInformado?: string): string {
    return hostInformado?.trim() || process.env.TENANT_DB_HOST || process.env.CORE_DB_HOST || 'localhost';
  }

  private obterPortaPadrao(portaInformada?: number): number {
    if (portaInformada !== undefined && portaInformada !== null) {
      return Number(portaInformada);
    }
    return Number(process.env.TENANT_DB_PORT || process.env.CORE_DB_PORT || 5432);
  }

  private obterSslPadrao(sslInformado?: boolean): boolean {
    if (typeof sslInformado === 'boolean') {
      return sslInformado;
    }

    const flag = process.env.TENANT_DB_SSL ?? process.env.CORE_DB_SSL ?? 'false';
    return flag.toLowerCase() === 'true';
  }

  private async provisionarBanco(configuracao: ConfiguracaoBancoTenant & { dbHost: string; dbPort: number; dbSsl: boolean }): Promise<void> {
    await this.criarUsuarioBanco(configuracao);
    await this.criarBaseDeDados(configuracao);
  }

  private async criarUsuarioBanco(configuracao: ConfiguracaoBancoTenant): Promise<void> {
    const queryRunner = this.obterQueryRunnerMaster();
    const identificadorUsuario = this.escaparIdentificadorPostgres(configuracao.dbUsername);

    const senhaLiteral = this.escaparLiteralPostgres(configuracao.dbPassword);

    try {
      await queryRunner.query(
        `CREATE ROLE ${identificadorUsuario} WITH LOGIN PASSWORD ${senhaLiteral}`
      );
    } catch (error: any) {
      if (error?.code === '42710') {
        await queryRunner.query(
          `ALTER ROLE ${identificadorUsuario} WITH LOGIN PASSWORD ${senhaLiteral}`
        );
      } else {
        throw error;
      }
    } finally {
      await queryRunner.release();
    }
  }

  private async criarBaseDeDados(configuracao: ConfiguracaoBancoTenant & { dbHost: string; dbPort: number; dbSsl: boolean }): Promise<void> {
    const queryRunner = this.obterQueryRunnerMaster();
    const nomeBancoEscapado = this.escaparIdentificadorPostgres(configuracao.dbName);
    const usuarioEscapado = this.escaparIdentificadorPostgres(configuracao.dbUsername);
    try {
      await queryRunner.query(`CREATE DATABASE ${nomeBancoEscapado} OWNER ${usuarioEscapado}`);
    } catch (error: any) {
      if (error?.code === '42P04') {
        throw new Error('Já existe um banco de dados provisionado para este identificador de tenant.');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private obterQueryRunnerMaster(): QueryRunner {
    if (!MasterDataSource.isInitialized) {
      throw new Error('Fonte de dados principal não está inicializada.');
    }
    return MasterDataSource.createQueryRunner();
  }

  private escaparIdentificadorPostgres(identificador: string): string {
    const semAspas = identificador.replace(/"/g, '""');
    return `"${semAspas}"`;
  }

  private escaparLiteralPostgres(valor: string): string {
    const comBarrasEscapadas = valor.replace(/\\/g, '\\\\');
    const comAspasEscapadas = comBarrasEscapadas.replace(/'/g, "''");
    return `E'${comAspasEscapadas}'`;
  }

  private async prepararEstruturaTenant(tenant: Tenant, configuracao: DetalhesCompletosBanco): Promise<void> {
    await this.instalarExtensoesObrigatorias(configuracao);

    tenant.dbHost = configuracao.dbHost;
    tenant.dbPort = configuracao.dbPort;
    tenant.dbSsl = configuracao.dbSsl;

    const dataSourceTenant = await tenantDSManager.getOrCreate(tenant);

    await this.popularEstadosECidades(dataSourceTenant);
  }

  private async instalarExtensoesObrigatorias(configuracao: DetalhesCompletosBanco): Promise<void> {
    const dataSourceAdministrador = await this.criarDataSourceTemporario(configuracao);

    try {
      await dataSourceAdministrador.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    } finally {
      await dataSourceAdministrador.destroy();
    }
  }

  private async criarDataSourceTemporario(configuracao: DetalhesCompletosBanco): Promise<DataSource> {
    const usuarioAdministrador = process.env.TENANT_DB_SUPER_USER || process.env.CORE_DB_USER || 'postgres';
    const senhaAdministrador = process.env.TENANT_DB_SUPER_PASS || process.env.CORE_DB_PASS || 'postgres';

    const dataSource = new DataSource({
      type: 'postgres',
      host: configuracao.dbHost,
      port: configuracao.dbPort,
      username: usuarioAdministrador,
      password: senhaAdministrador,
      database: configuracao.dbName,
      ssl: configuracao.dbSsl ? { rejectUnauthorized: false } : undefined,
      synchronize: false,
      logging: false,
      entities: [CAMINHO_ENTIDADES],
      migrations: [CAMINHO_MIGRACOES],
    });

    await dataSource.initialize();
    return dataSource;
  }

  private async popularEstadosECidades(dataSource: DataSource): Promise<void> {
    const repositorioEstados = dataSource.getRepository(Estado);
    const repositorioCidades = dataSource.getRepository(Cidade);

    const totalEstados = await repositorioEstados.count();
    const totalCidades = await repositorioCidades.count();

    if (totalEstados > 0 && totalCidades > 0) {
      return;
    }

    await importarDadosIbgeNoDataSource(dataSource);
  }

  private validarFormatoCnpj(cnpj?: string | null) {
    if (!cnpj) {
      throw new Error('Campo cnpj é obrigatório.');
    }

    const somenteNumeros = this.removerNaoNumericos(cnpj);
    if (somenteNumeros.length !== 14) {
      throw new Error('CNPJ deve possuir 14 dígitos.');
    }
  }

  private validarEmailSeInformado(email?: string | null) {
    if (!email) {
      return;
    }

    const emailNormalizado = email.trim();
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!regexEmail.test(emailNormalizado)) {
      throw new Error('E-mail de contato inválido.');
    }
  }

  private validarTelefoneSeInformado(telefone?: string | null) {
    if (!telefone) {
      return;
    }

    const telefoneNormalizado = this.removerNaoNumericos(telefone);
    if (telefoneNormalizado.length < 10 || telefoneNormalizado.length > 11) {
      throw new Error('Telefone de contato inválido.');
    }
  }

  private removerNaoNumericos(texto: string): string {
    return texto.replace(/\D/g, '');
  }
}
