import { DataSource } from 'typeorm';
import { FormaPagamento } from '../entities/FormaPagamento';

const FORMAS_PADRAO: string[] = [
  'Pagamento à vista',
  'Pagamento único a prazo',
  'Pagamento parcelado',
];

export async function garantirFormasPagamentoPadrao(dataSource: DataSource): Promise<void> {
  const repositorio = dataSource.getRepository(FormaPagamento);

  for (const descricao of FORMAS_PADRAO) {
    const existente = await repositorio.findOne({ where: { descricao } });
    if (existente) {
      continue;
    }

    const novaForma = repositorio.create({ descricao });
    await repositorio.save(novaForma);
  }
}
