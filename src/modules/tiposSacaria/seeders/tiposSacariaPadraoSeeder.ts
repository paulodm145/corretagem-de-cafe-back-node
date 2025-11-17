import { DataSource } from 'typeorm';
import { TipoSacaria } from '../entities/TipoSacaria';

const TIPOS_PADRAO: Array<{ descricao: string; ativo?: boolean }> = [
  { descricao: 'Sacaria nova 60kg' },
  { descricao: 'Sacaria usada 60kg' },
  { descricao: 'Big bag 1000kg' },
  { descricao: 'Café granel ensacado' },
  { descricao: 'Carga a granel' },
];

export async function garantirTiposSacariaPadrao(dataSource: DataSource): Promise<void> {
  const repositorio = dataSource.getRepository(TipoSacaria);

  for (const tipo of TIPOS_PADRAO) {
    const existente = await repositorio.findOne({ where: { descricao: tipo.descricao } });
    if (!existente) {
      const novaSacaria = repositorio.create({ descricao: tipo.descricao, ativo: tipo.ativo ?? true });
      await repositorio.save(novaSacaria);
    }
  }
}
