import { DataSource } from 'typeorm';
import { authConfig } from '../../../config/auth-config';
import { gerarHashSenha } from '../../../utils/criptografia-senha';
import { Usuario } from '../entities/Usuario';

const EMAIL_PADRAO = 'admin@tenant.local';

function gerarEmailPadrao(nomeTenant: string): string {
  const slug = nomeTenant
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/\.+/g, '.')
    .replace(/^\.|\.$/g, '')
    .toLowerCase();

  if (!slug) {
    return EMAIL_PADRAO;
  }

  return `admin@${slug}.local`;
}

export async function garantirUsuarioPadrao(
  dataSource: DataSource,
  contexto: { nomeTenant: string; emailContato?: string | null }
): Promise<void> {
  const repositorio = dataSource.getRepository(Usuario);
  const totalUsuarios = await repositorio.count();

  if (totalUsuarios > 0) {
    return;
  }

  const emailNormalizado = contexto.emailContato?.trim().toLowerCase();
  const email = emailNormalizado || gerarEmailPadrao(contexto.nomeTenant);
  const senhaPlano = authConfig.senhaPadrao;
  const senhaHash = gerarHashSenha(senhaPlano);

  const usuario = repositorio.create({
    nome: 'Administrador',
    email,
    senhaHash,
    ativo: true,
  });

  await repositorio.save(usuario);

  console.log(
    `[TENANT:${contexto.nomeTenant}] Usuário padrão criado. Login: ${email} | Senha: ${senhaPlano}`
  );
}
