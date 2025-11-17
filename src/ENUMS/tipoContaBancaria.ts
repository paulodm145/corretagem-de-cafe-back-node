export enum TipoContaBancaria {
  CORRENTE = 'CORRENTE',
  POUPANCA = 'POUPANCA',
  SALARIO = 'SALARIO',
  PAGAMENTO = 'PAGAMENTO',
}

export const mapaCodigoParaTipoContaBancaria: Record<number, TipoContaBancaria> = {
  1: TipoContaBancaria.CORRENTE,
  2: TipoContaBancaria.POUPANCA,
  3: TipoContaBancaria.SALARIO,
  4: TipoContaBancaria.PAGAMENTO,
};
