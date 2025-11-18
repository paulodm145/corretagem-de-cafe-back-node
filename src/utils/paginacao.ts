import { z } from 'zod';

export type DirecaoOrdenacao = 'ASC' | 'DESC';

export interface ParametrosListagem {
  pagina: number;
  limite: number;
  ordenarPor: string;
  ordenacao: DirecaoOrdenacao;
  busca?: string;
}

export interface ListaPaginada<T> {
  dados: T[];
  pagina: number;
  limite: number;
  total: number;
  totalPaginas: number;
}

const DIRECOES = ['ASC', 'DESC'] as const;

type DirecaoTuple = typeof DIRECOES;

type CampoOrdenacao = [string, ...string[]];

const transformarCampoOrdenacao = (campos: readonly string[]): CampoOrdenacao => {
  if (campos.length === 0) {
    throw new Error('Defina ao menos um campo de ordenação.');
  }
  return campos as CampoOrdenacao;
};

export const criarSchemaListagem = (opcoes: {
  camposOrdenacao: readonly string[];
  ordenarPorPadrao: string;
  limiteMaximo?: number;
}) => {
  const { camposOrdenacao, ordenarPorPadrao, limiteMaximo = 100 } = opcoes;
  const camposOrdenacaoTuple = transformarCampoOrdenacao(camposOrdenacao);

  return z
    .object({
      pagina: z
        .coerce.number()
        .int('Página deve ser um inteiro.')
        .positive('Página deve ser um inteiro positivo.')
        .optional()
        .default(1),
      limite: z
        .coerce.number()
        .int('Limite deve ser um inteiro.')
        .positive('Limite deve ser um inteiro positivo.')
        .max(limiteMaximo, `Limite máximo permitido é ${limiteMaximo}.`)
        .optional()
        .default(20),
      ordenarPor: z
        .enum(camposOrdenacaoTuple)
        .optional()
        .transform((valor) => valor ?? ordenarPorPadrao),
      ordenacao: z
        .enum(DIRECOES as DirecaoTuple)
        .optional()
        .transform((valor) => (valor ? (valor.toUpperCase() as DirecaoOrdenacao) : 'ASC')),
      busca: z
        .string()
        .optional()
        .transform((valor) => (valor ? valor.trim() : undefined)),
    })
    .transform((valor) => ({
      pagina: valor.pagina ?? 1,
      limite: valor.limite ?? 20,
      ordenarPor: valor.ordenarPor ?? ordenarPorPadrao,
      ordenacao: (valor.ordenacao ?? 'ASC') as DirecaoOrdenacao,
      busca: valor.busca || undefined,
    }));
};

export const calcularTotalPaginas = (total: number, limite: number): number => {
  if (limite <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(total / limite));
};
