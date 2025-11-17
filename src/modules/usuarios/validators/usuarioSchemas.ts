import { z } from 'zod';

const nomeSchema = z
  .string()
  .trim()
  .min(3, 'Nome deve possuir ao menos 3 caracteres.')
  .max(150, 'Nome deve possuir no máximo 150 caracteres.');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('E-mail inválido.')
  .max(180, 'E-mail deve possuir no máximo 180 caracteres.');

const senhaSchema = z
  .string()
  .min(8, 'Senha deve possuir ao menos 8 caracteres.')
  .max(64, 'Senha deve possuir no máximo 64 caracteres.');

export const criarUsuarioSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  senha: senhaSchema,
  ativo: z.boolean().optional().default(true),
});

export const atualizarUsuarioSchema = z
  .object({
    nome: nomeSchema.optional(),
    email: emailSchema.optional(),
    senha: senhaSchema.optional(),
    ativo: z.boolean().optional(),
  })
  .refine((dados) => Object.keys(dados).length > 0, {
    message: 'Informe ao menos um campo para atualização.',
  });
