import { Response } from 'express';
import { ZodError } from 'zod';
import { ErroAplicacao } from '../errors/ErroAplicacao';
import { TenantResolverError } from '../tenancy/tenant-token-resolver';

export interface RespostaErroPadrao {
  codigo: string;
  mensagem: string;
  detalhes?: string[];
}

export const CODIGOS_ERRO = {
  VALIDACAO: 'ERRO_VALIDACAO',
  NAO_ENCONTRADO: 'NAO_ENCONTRADO',
  NEGOCIO: 'ERRO_NEGOCIO',
  INTERNO: 'ERRO_INTERNO',
} as const;

export function mapearErroPadrao(erro: unknown): { statusCode: number; corpo: RespostaErroPadrao } {
  if (erro instanceof ErroAplicacao) {
    return {
      statusCode: erro.statusCode,
      corpo: {
        codigo: erro.codigo,
        mensagem: erro.message,
        detalhes: erro.detalhes,
      },
    };
  }

  if (erro instanceof ZodError) {
    const detalhes = erro.issues.map((issue) => issue.message);
    return {
      statusCode: 400,
      corpo: {
        codigo: CODIGOS_ERRO.VALIDACAO,
        mensagem: 'Há dados inválidos no payload enviado.',
        detalhes,
      },
    };
  }

  if (erro instanceof TenantResolverError) {
    return {
      statusCode: erro.statusCode,
      corpo: {
        codigo: CODIGOS_ERRO.NEGOCIO,
        mensagem: erro.message,
      },
    };
  }

  if (erro instanceof Error) {
    const mensagem = erro.message || 'Erro ao processar a solicitação.';
    if (mensagem.toLowerCase().includes('não encontrado')) {
      return {
        statusCode: 404,
        corpo: {
          codigo: CODIGOS_ERRO.NAO_ENCONTRADO,
          mensagem,
        },
      };
    }

    return {
      statusCode: 400,
      corpo: {
        codigo: CODIGOS_ERRO.NEGOCIO,
        mensagem,
      },
    };
  }

  return {
    statusCode: 500,
    corpo: {
      codigo: CODIGOS_ERRO.INTERNO,
      mensagem: 'Erro interno ao processar a requisição.',
    },
  };
}

export function responderComErroPadrao(response: Response, erro: unknown): Response {
  const { statusCode, corpo } = mapearErroPadrao(erro);
  return response.status(statusCode).json(corpo);
}
