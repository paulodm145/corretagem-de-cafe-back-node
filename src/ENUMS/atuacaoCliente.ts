export enum AtuacaoCliente {
  MERCADO_INTERNO = 'MERCADO_INTERNO',
  EXPORTADOR = 'EXPORTADOR',
  TORREFADOR = 'TORREFADOR',
  CORRETOR = 'CORRETOR',
}

export const mapaCodigoParaAtuacaoCliente: Record<number, AtuacaoCliente> = {
  1: AtuacaoCliente.MERCADO_INTERNO,
  2: AtuacaoCliente.EXPORTADOR,
  3: AtuacaoCliente.TORREFADOR,
  4: AtuacaoCliente.CORRETOR,
};

export const codigosAtuacaoCliente = Object.keys(mapaCodigoParaAtuacaoCliente).map((chave) => Number(chave));
