import axios from 'axios';
import { DataSource } from 'typeorm';

export type BancoBrasilApi = {
  ispb: string;
  name: string;
  fullName: string;
  code: number | null;
};

const URL_BANCOS = 'https://brasilapi.com.br/api/banks/v1';

export async function importarBancosNoDataSource(dataSource: DataSource): Promise<number> {
  const bancos = await buscarBancosBrasilApi();

  if (!bancos.length) {
    return 0;
  }

  const valores: string[] = [];
  const parametros: Array<string | number | null> = [];

  bancos.forEach((banco, indice) => {
    const indiceBase = indice * 4;
    valores.push(`($${indiceBase + 1}, $${indiceBase + 2}, $${indiceBase + 3}, $${indiceBase + 4})`);
    parametros.push(banco.codigo, banco.ispb, banco.nome, banco.nomeCompleto);
  });

  const sql = `
    INSERT INTO public.bancos (codigo, ispb, nome, nome_completo)
    VALUES ${valores.join(',')}
    ON CONFLICT (ispb) DO UPDATE
      SET codigo = EXCLUDED.codigo,
          nome = EXCLUDED.nome,
          nome_completo = EXCLUDED.nome_completo,
          updated_at = now();
  `;

  await dataSource.query(sql, parametros);
  return bancos.length;
}

async function buscarBancosBrasilApi(): Promise<Array<{ codigo: number | null; ispb: string; nome: string; nomeCompleto: string }>> {
  const resposta = await axios.get<BancoBrasilApi[]>(URL_BANCOS);

  return resposta.data
    .map((banco) => ({
      codigo: typeof banco.code === 'number' ? banco.code : null,
      ispb: banco.ispb.trim(),
      nome: banco.name.trim(),
      nomeCompleto: banco.fullName.trim(),
    }))
    .sort((bancoA, bancoB) => bancoA.nome.localeCompare(bancoB.nome));
}
