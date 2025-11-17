import { config } from 'dotenv';

config();

const segredo = process.env.AUTH_SECRET || 'default-secret';
const expiresIn = process.env.AUTH_EXPIRES_IN || '1h';
const senhaPadrao = process.env.TENANT_USUARIO_SENHA_PADRAO || 'Senha@123';

export const authConfig = {
  segredo,
  expiresIn,
  senhaPadrao,
};
