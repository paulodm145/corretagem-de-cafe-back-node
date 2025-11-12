import crypto from 'node:crypto';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}<>?';

export function gerarSenhaSegura(tamanho = 32): string {
  if (tamanho < 12) {
    throw new Error('O tamanho mínimo da senha segura deve ser de 12 caracteres.');
  }

  const bytesAleatorios = crypto.randomBytes(tamanho);
  const caracteres = Array.from(bytesAleatorios).map((byte) => {
    const indice = byte % ALFABETO.length;
    return ALFABETO[indice];
  });

  return embaralhar(caracteres).join('');
}

function embaralhar(caracteres: string[]): string[] {
  const copia = [...caracteres];
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}
