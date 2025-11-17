import { DataSource } from 'typeorm';
import { CondicaoPagamento } from '../entities/CondicaoPagamento';
import { FormaPagamento } from '../../formasPagamento/entities/FormaPagamento';

const CONDICOES_PADRAO: Array<{
  descricao: string;
  formaNome: string;
  quantidadeParcelas: number;
  primeiraParcelaEmDias: number;
  intervaloDias: number;
}> = [
  {
    descricao: 'Pagamento imediato',
    formaNome: 'A VISTA',
    quantidadeParcelas: 1,
    primeiraParcelaEmDias: 0,
    intervaloDias: 0,
  },
  {
    descricao: '30 dias',
    formaNome: 'A PRAZO',
    quantidadeParcelas: 1,
    primeiraParcelaEmDias: 30,
    intervaloDias: 0,
  },
  {
    descricao: '45 dias',
    formaNome: 'A PRAZO',
    quantidadeParcelas: 1,
    primeiraParcelaEmDias: 45,
    intervaloDias: 0,
  },
  {
    descricao: '30/60 dias',
    formaNome: 'PARCELADO',
    quantidadeParcelas: 2,
    primeiraParcelaEmDias: 30,
    intervaloDias: 30,
  },
  {
    descricao: 'Entrada + 2x mensais',
    formaNome: 'PARCELADO',
    quantidadeParcelas: 3,
    primeiraParcelaEmDias: 0,
    intervaloDias: 30,
  },
];

export async function garantirCondicoesPagamentoPadrao(dataSource: DataSource): Promise<void> {
  const formaRepositorio = dataSource.getRepository(FormaPagamento);
  const condicaoRepositorio = dataSource.getRepository(CondicaoPagamento);

  const formas = await formaRepositorio.find();
  const formasPorNome = new Map(formas.map((forma) => [forma.nome, forma]));

  for (const condicao of CONDICOES_PADRAO) {
    const forma = formasPorNome.get(condicao.formaNome);
    if (!forma) {
      continue;
    }

    const existente = await condicaoRepositorio.findOne({ where: { descricao: condicao.descricao } });
    if (existente) {
      continue;
    }

    const novaCondicao = condicaoRepositorio.create({
      descricao: condicao.descricao,
      formaPagamentoId: forma.id,
      quantidadeParcelas: condicao.quantidadeParcelas,
      primeiraParcelaEmDias: condicao.primeiraParcelaEmDias,
      intervaloDias: condicao.intervaloDias,
    });

    await condicaoRepositorio.save(novaCondicao);
  }
}
