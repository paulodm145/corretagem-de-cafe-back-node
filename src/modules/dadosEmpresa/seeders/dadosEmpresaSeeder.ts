import { DataSource } from 'typeorm';
import { DadosEmpresa } from '../entities/DadosEmpresa';

const LOGO_PADRAO_BASE64 = Buffer.from('Logo padrão da corretora').toString('base64');

export const DADOS_EMPRESA_PADRAO = {
  cnpj: '12345678000199',
  logoBase64: LOGO_PADRAO_BASE64,
  email: 'contato@empresa-exemplo.com',
  telefone: '11999990000',
  endereco: 'Avenida Central, 1000 - Centro, São Paulo/SP',
  site: 'https://www.empresa-exemplo.com',
};

export const garantirDadosEmpresaPadrao = async (dataSource: DataSource): Promise<void> => {
  const repositorio = dataSource.getRepository(DadosEmpresa);
  const total = await repositorio.count();

  if (total > 0) {
    return;
  }

  const registro = repositorio.create(DADOS_EMPRESA_PADRAO);

  await repositorio.save(registro);
};
