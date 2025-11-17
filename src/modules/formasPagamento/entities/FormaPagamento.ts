import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CondicaoPagamento } from '../../condicoesPagamento/entities/CondicaoPagamento';

@Entity('formas_pagamento')
export class FormaPagamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  nome!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descricao!: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => CondicaoPagamento, (condicao) => condicao.formaPagamento)
  condicoes?: CondicaoPagamento[];
}
