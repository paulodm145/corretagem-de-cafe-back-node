import { DataSource } from 'typeorm';
import { FormaPagamento } from '../entities/FormaPagamento';

const FORMAS_PADRAO: Array<{ nome: string; descricao?: string | null }> = [
  { nome: 'A VISTA', descricao: 'Pagamento liquidado imediatamente.' },
  { nome: 'A PRAZO', descricao: 'Pagamento único após período combinado.' },
  { nome: 'PARCELADO', descricao: 'Pagamento dividido em parcelas.' },
];

export async function garantirFormasPagamentoPadrao(dataSource: DataSource): Promise<void> {
  const repositorio = dataSource.getRepository(FormaPagamento);

  for (const forma of FORMAS_PADRAO) {
    const existente = await repositorio.findOne({ where: { nome: forma.nome } });
    if (!existente) {
      const novaForma = repositorio.create({ nome: forma.nome, descricao: forma.descricao ?? null });
      await repositorio.save(novaForma);
    }
  }
}
