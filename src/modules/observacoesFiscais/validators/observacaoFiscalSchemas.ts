import { z } from 'zod';
import { TipoObservacaoFiscal } from '../../../ENUMS/tipoObservacaoFiscal';

const tipoObservacaoFiscalSchema = z.preprocess(
  (valor) => (typeof valor === 'string' ? valor.trim().toUpperCase() : valor),
  z.nativeEnum(TipoObservacaoFiscal)
);

const descricaoSchema = z.string().trim().min(5, 'Descrição deve conter ao menos 5 caracteres.');

export const criarObservacaoFiscalSchema = z.object({
  descricao: descricaoSchema,
  tipo: tipoObservacaoFiscalSchema,
});

export const atualizarObservacaoFiscalSchema = z
  .object({
    descricao: descricaoSchema.optional(),
    tipo: tipoObservacaoFiscalSchema.optional(),
  })
  .refine((dados) => dados.descricao || dados.tipo, {
    message: 'Informe ao menos um campo para atualização.',
    path: ['descricao'],
  });

export const filtroTipoObservacaoSchema = z.object({
  tipo: tipoObservacaoFiscalSchema,
});
