import { z } from 'zod';

const descricaoSchema = z
  .string()
  .trim()
  .min(3, 'Descrição deve possuir ao menos 3 caracteres.')
  .max(150, 'Descrição deve possuir no máximo 150 caracteres.');

export const criarTipoSacariaSchema = z.object({
  descricao: descricaoSchema,
  ativo: z.boolean().optional(),
});

export const atualizarTipoSacariaSchema = z
  .object({
    descricao: descricaoSchema.optional(),
    ativo: z.boolean().optional(),
  })
  .refine((dados) => typeof dados.descricao === 'string' || typeof dados.ativo === 'boolean', {
    message: 'Informe ao menos um campo para atualização.',
  });
