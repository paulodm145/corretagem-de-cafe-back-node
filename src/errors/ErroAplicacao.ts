export class ErroAplicacao extends Error {
  constructor(
    public readonly codigo: string,
    mensagem: string,
    public readonly statusCode = 400,
    public readonly detalhes?: string[]
  ) {
    super(mensagem);
    this.name = 'ErroAplicacao';
  }
}
