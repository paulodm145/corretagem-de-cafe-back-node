import axios from 'axios';
import { DataSource } from 'typeorm';

export type EstadoIbge = { id: number; sigla: string; nome: string };
export type MunicipioIbge = { nome: string; codigo_ibge: string | number };

export type ObservadoresImportacaoIbge = {
  aoIniciarImportacaoEstado?: (estado: EstadoIbge) => void;
  aoAtualizarProgressoMunicipios?: (estado: EstadoIbge, quantidadeImportada: number, totalMunicipios: number) => void;
  aoFinalizarImportacaoEstado?: (estado: EstadoIbge, totalMunicipios: number) => void;
};

const URL_ESTADOS = 'https://brasilapi.com.br/api/ibge/uf/v1';
const URL_MUNICIPIOS = (sigla: string) => `https://brasilapi.com.br/api/ibge/municipios/v1/${sigla}`;
const TAMANHO_LOTE_INSERCAO = 800;

export async function importarDadosIbgeNoDataSource(
  dataSource: DataSource,
  observadores?: ObservadoresImportacaoIbge
): Promise<{ totalEstados: number; totalMunicipios: number }> {
  const estados = await buscarEstados();
  await inserirOuAtualizarEstados(dataSource, estados);

  let totalMunicipiosImportados = 0;

  for (const estado of estados) {
    observadores?.aoIniciarImportacaoEstado?.(estado);

    const municipios = await buscarMunicipios(estado.sigla);
    await inserirOuAtualizarMunicipios(dataSource, estado, municipios, observadores);

    totalMunicipiosImportados += municipios.length;
    observadores?.aoFinalizarImportacaoEstado?.(estado, municipios.length);
  }

  return { totalEstados: estados.length, totalMunicipios: totalMunicipiosImportados };
}

async function buscarEstados(): Promise<EstadoIbge[]> {
  const resposta = await axios.get<EstadoIbge[]>(URL_ESTADOS);
  return [...resposta.data].sort((estadoA, estadoB) => estadoA.sigla.localeCompare(estadoB.sigla));
}

async function buscarMunicipios(siglaEstado: string): Promise<MunicipioIbge[]> {
  const resposta = await axios.get<MunicipioIbge[]>(URL_MUNICIPIOS(siglaEstado));
  return resposta.data;
}

async function inserirOuAtualizarEstados(dataSource: DataSource, estados: EstadoIbge[]): Promise<void> {
  if (!estados.length) {
    return;
  }

  const valores: string[] = [];
  const parametros: Array<number | string> = [];

  estados.forEach((estado, indice) => {
    const indiceBase = indice * 3;
    valores.push(`($${indiceBase + 1}, $${indiceBase + 2}, $${indiceBase + 3})`);
    parametros.push(estado.id, estado.nome, estado.sigla);
  });

  const sql = `
    INSERT INTO public.estados (id, nome, sigla)
    VALUES ${valores.join(',')}
    ON CONFLICT (id) DO UPDATE
      SET nome = EXCLUDED.nome,
          sigla = EXCLUDED.sigla,
          updated_at = now();
  `;

  await dataSource.query(sql, parametros);
}

async function inserirOuAtualizarMunicipios(
  dataSource: DataSource,
  estado: EstadoIbge,
  municipios: MunicipioIbge[],
  observadores?: ObservadoresImportacaoIbge
): Promise<void> {
  if (!municipios.length) {
    observadores?.aoAtualizarProgressoMunicipios?.(estado, 0, 0);
    return;
  }

  for (let indice = 0; indice < municipios.length; indice += TAMANHO_LOTE_INSERCAO) {
    const lote = municipios.slice(indice, indice + TAMANHO_LOTE_INSERCAO);
    const valores: string[] = [];
    const parametros: Array<number | string> = [];

    lote.forEach((municipio, posicao) => {
      const id = Number(municipio.codigo_ibge);
      const nome = String(municipio.nome).trim();
      const indiceBase = posicao * 3;

      valores.push(`($${indiceBase + 1}, $${indiceBase + 2}, $${indiceBase + 3})`);
      parametros.push(id, nome, estado.id);
    });

    const sql = `
      INSERT INTO public.cidades (id, nome, estado_id)
      VALUES ${valores.join(',')}
      ON CONFLICT (id) DO UPDATE
        SET nome = EXCLUDED.nome,
            estado_id = EXCLUDED.estado_id,
            updated_at = now();
    `;

    await dataSource.query(sql, parametros);

    const quantidadeProcessada = Math.min(indice + lote.length, municipios.length);
    observadores?.aoAtualizarProgressoMunicipios?.(estado, quantidadeProcessada, municipios.length);
  }
}
