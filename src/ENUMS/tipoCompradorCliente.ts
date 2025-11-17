export enum TipoCompradorCliente {
  PRODUTOR = 'PRODUTOR',
  COMPRADOR = 'COMPRADOR',
  PRODUTOR_COMPRADOR = 'PRODUTOR_COMPRADOR',
}

export const mapaCodigoParaTipoCompradorCliente: Record<number, TipoCompradorCliente> = {
  1: TipoCompradorCliente.PRODUTOR,
  2: TipoCompradorCliente.COMPRADOR,
  3: TipoCompradorCliente.PRODUTOR_COMPRADOR,
};

export const codigosTipoCompradorCliente = Object.keys(mapaCodigoParaTipoCompradorCliente).map((chave) => Number(chave));
