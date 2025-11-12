// src/commands/ibge-import-sql.ts
import 'reflect-metadata';
import { AppDataSource } from '../config/data-source';
import {
  importarDadosIbgeNoDataSource,
  ObservadoresImportacaoIbge,
} from '../modules/ibge/importador-ibge';

function barraProgresso(qtdAtual: number, total: number, largura = 28): string {
  if (!total) {
    return '[----------------------------] 0% (0/0)';
  }

  const percentual = qtdAtual / total;
  const preenchido = Math.round(largura * percentual);
  const preenchimento = '#'.repeat(preenchido);
  const restante = '.'.repeat(Math.max(largura - preenchido, 0));
  const percentualFormatado = Math.min(100, Math.round(percentual * 100));

  return `[${preenchimento}${restante}] ${percentualFormatado}% (${qtdAtual}/${total})`;
}

const observadoresConsole: ObservadoresImportacaoIbge = {
  aoIniciarImportacaoEstado: (estado) => {
    process.stdout.write(`\n${estado.sigla}: iniciando...\n`);
  },
  aoAtualizarProgressoMunicipios: (estado, quantidadeImportada, totalMunicipios) => {
    if (!totalMunicipios) {
      process.stdout.write(`\r${estado.sigla}: nenhum município retornado.`);
      return;
    }

    process.stdout.write(`\r${estado.sigla} ${barraProgresso(quantidadeImportada, totalMunicipios)}`);
  },
  aoFinalizarImportacaoEstado: () => {
    process.stdout.write('\n');
  },
};

async function executarImportacaoIbge(): Promise<void> {
  const dataSource = await AppDataSource.initialize();

  try {
    console.time('ibge-import');

    const resultado = await importarDadosIbgeNoDataSource(dataSource, observadoresConsole);

    console.log(`\nEstados atualizados: ${resultado.totalEstados}`);
    console.log(`Municípios processados: ${resultado.totalMunicipios}`);

    const resumo = await dataSource.query(`
      SELECT e.sigla, e.nome, COUNT(c.id)::int AS municipios
      FROM public.estados e
      LEFT JOIN public.cidades c ON c.estado_id = e.id
      GROUP BY e.id, e.sigla, e.nome
      ORDER BY e.sigla;
    `);

    console.log('\nMunicípios por UF:');
    console.table(resumo);

    console.timeEnd('ibge-import');
  } catch (erro) {
    console.error('Erro no import:', erro);
    process.exitCode = 1;
  } finally {
    await dataSource.destroy();
  }
}

executarImportacaoIbge();
