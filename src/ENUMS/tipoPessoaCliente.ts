export enum TipoPessoaCliente {
  PESSOA_FISICA = 'PESSOA_FISICA',
  PESSOA_JURIDICA = 'PESSOA_JURIDICA',
}

export const mapaCodigoParaTipoPessoaCliente: Record<number, TipoPessoaCliente> = {
  1: TipoPessoaCliente.PESSOA_FISICA,
  2: TipoPessoaCliente.PESSOA_JURIDICA,
};

export const codigosTipoPessoaCliente = Object.keys(mapaCodigoParaTipoPessoaCliente).map((chave) => Number(chave));
