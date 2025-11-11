// src/commands/ibge-import-sql.ts
import "reflect-metadata";
import axios from "axios";
import { AppDataSource } from "../config/data-source";

type UfApi = { id: number; sigla: string; nome: string };
type MunicipioApi = { nome: string; codigo_ibge: string | number };

const UF_URL = "https://brasilapi.com.br/api/ibge/uf/v1";
const MUN_URL = (sigla: string) =>
  `https://brasilapi.com.br/api/ibge/municipios/v1/${sigla}`;

function bar(curr: number, total: number, width = 28) {
  const pct = total ? curr / total : 1;
  const full = Math.round(width * pct);
  return `[${"#".repeat(full)}${".".repeat(width - full)}] ${Math.min(
    100,
    Math.round(pct * 100)
  )}% (${curr}/${total})`;
}

async function upsertEstados(ds: any, ufs: UfApi[]) {
  // PARAMETRIZADO: (id, nome, sigla)
  const params: any[] = [];
  const tuples: string[] = [];

  ufs.forEach((u, i) => {
    const base = i * 3;
    tuples.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
    params.push(u.id, u.nome, u.sigla);
  });

  const sql = `
    INSERT INTO public.estados (id, nome, sigla)
    VALUES ${tuples.join(",")}
    ON CONFLICT (id) DO UPDATE
      SET nome = EXCLUDED.nome,
          sigla = EXCLUDED.sigla,
          updated_at = now();
  `;

  await ds.query(sql, params);
}

async function upsertMunicipiosDaUF(
  ds: any,
  uf: { id: number; sigla: string },
  municipios: MunicipioApi[]
) {
  if (!municipios.length) return;

  // Inserção em lotes PARAMETRIZADA
  const chunk = 800;
  for (let i = 0; i < municipios.length; i += chunk) {
    const slice = municipios.slice(i, i + chunk);

    const params: any[] = [];
    const tuples: string[] = [];

    slice.forEach((m, j) => {
      const id = Number(m.codigo_ibge); // cabe em int4
      const nome = String(m.nome).trim();
      const base = j * 3;
      tuples.push(`($${base + 1}, $${base + 2}, $${base + 3})`);
      params.push(id, nome, uf.id);
    });

    const sql = `
      INSERT INTO public.cidades (id, nome, estado_id)
      VALUES ${tuples.join(",")}
      ON CONFLICT (id) DO UPDATE
        SET nome = EXCLUDED.nome,
            estado_id = EXCLUDED.estado_id,
            updated_at = now();
    `;

    await ds.query(sql, params);
    // progresso por lote
    const done = Math.min(i + slice.length, municipios.length);
    process.stdout.write(`\r${uf.sigla} ${bar(done, municipios.length)}`);
  }
  process.stdout.write("\n");
}

async function main() {
  const ds = await AppDataSource.initialize();
  try {
    console.time("ibge-import");

    // 1) Estados
    const { data: ufsRaw } = await axios.get<UfApi[]>(UF_URL);
    const ufs = [...ufsRaw].sort((a, b) => a.sigla.localeCompare(b.sigla));
    await upsertEstados(ds, ufs);
    console.log(`Estados upserted: ${ufs.length}`);

    // 2) Municípios por UF (barra de progresso por UF)
    for (const uf of ufs) {
      process.stdout.write(`\n${uf.sigla}: iniciando...\n`);
      try {
        const { data: municipios } = await axios.get<MunicipioApi[]>(
          MUN_URL(uf.sigla)
        );
        await upsertMunicipiosDaUF(ds, uf, municipios);
      } catch (e) {
        console.error(`${uf.sigla}: erro ao importar municípios`, e);
      }
    }

    // 3) Resumo final
    const rows = await ds.query(`
      SELECT e.sigla, e.nome, COUNT(c.id)::int AS municipios
      FROM public.estados e
      LEFT JOIN public.cidades c ON c.estado_id = e.id
      GROUP BY e.id, e.sigla, e.nome
      ORDER BY e.sigla;
    `);

    console.log("\nMunicípios por UF:");
    console.table(rows);

    console.timeEnd("ibge-import");
  } catch (e) {
    console.error("Erro no import:", e);
    process.exitCode = 1;
  } finally {
    await ds.destroy();
  }
}

main();
