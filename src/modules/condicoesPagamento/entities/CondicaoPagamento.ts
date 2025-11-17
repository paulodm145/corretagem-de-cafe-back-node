import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FormaPagamento } from '../../formasPagamento/entities/FormaPagamento';

@Entity('condicoes_pagamento')
export class CondicaoPagamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'forma_pagamento_id', type: 'integer' })
  formaPagamentoId!: number;

  @ManyToOne(() => FormaPagamento, (forma) => forma.condicoes, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'forma_pagamento_id' })
  formaPagamento!: FormaPagamento;

  @Column({ type: 'varchar', length: 150 })
  descricao!: string;

  @Column({ name: 'quantidade_parcelas', type: 'integer', default: 1 })
  quantidadeParcelas!: number;

  @Column({ name: 'primeira_parcela_em_dias', type: 'integer', default: 0 })
  primeiraParcelaEmDias!: number;

  @Column({ name: 'intervalo_dias', type: 'integer', default: 0 })
  intervaloDias!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
