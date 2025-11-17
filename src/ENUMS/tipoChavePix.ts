export enum TipoChavePix {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  EMAIL = 'EMAIL',
  TELEFONE = 'TELEFONE',
  ALEATORIA = 'ALEATORIA',
}

export const mapaCodigoParaTipoChavePix: Record<number, TipoChavePix> = {
  1: TipoChavePix.CPF,
  2: TipoChavePix.CNPJ,
  3: TipoChavePix.EMAIL,
  4: TipoChavePix.TELEFONE,
  5: TipoChavePix.ALEATORIA,
};
