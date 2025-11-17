import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TipoObservacaoFiscal } from '../../../ENUMS/tipoObservacaoFiscal';

@Entity('observacoes_fiscais')
export class ObservacaoFiscal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  descricao!: string;

  @Column({ type: 'enum', enum: TipoObservacaoFiscal, enumName: 'observacao_fiscal_tipo_enum' })
  tipo!: TipoObservacaoFiscal;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
