import { DataSource } from 'typeorm';
import { CondicaoPagamento } from '../entities/CondicaoPagamento';

const CONDICOES_PADRAO: string[] = [
  'Pagamento imediato',
  'Pagamento em 30 dias',
  'Pagamento em 45 dias',
  'Pagamento parcelado em 2 vezes',
  'Pagamento parcelado em 3 vezes',
];

export async function garantirCondicoesPagamentoPadrao(dataSource: DataSource): Promise<void> {
  const condicaoRepositorio = dataSource.getRepository(CondicaoPagamento);

  for (const descricao of CONDICOES_PADRAO) {
    const existente = await condicaoRepositorio.findOne({ where: { descricao } });
    if (existente) {
      continue;
    }

    const novaCondicao = condicaoRepositorio.create({ descricao });
    await condicaoRepositorio.save(novaCondicao);
  }
}
