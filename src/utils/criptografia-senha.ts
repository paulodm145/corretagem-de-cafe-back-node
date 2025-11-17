import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const ITERACOES = 120000;
const TAMANHO_CHAVE = 64;
const DIGEST = 'sha512';

export function gerarHashSenha(senha: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(senha, salt, ITERACOES, TAMANHO_CHAVE, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

export function compararSenha(comparacao: { senha: string; hashArmazenado: string }): boolean {
  const [salt, hashEsperado] = comparacao.hashArmazenado.split(':');
  if (!salt || !hashEsperado) {
    return false;
  }

  const hashCalculado = pbkdf2Sync(comparacao.senha, salt, ITERACOES, TAMANHO_CHAVE, DIGEST).toString('hex');

  return timingSafeEqual(Buffer.from(hashEsperado, 'hex'), Buffer.from(hashCalculado, 'hex'));
}
