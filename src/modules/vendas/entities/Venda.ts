import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/Cliente';

@Entity('vendas')
export class Venda {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'numero_contrato', type: 'varchar', length: 60 })
  numeroContrato!: string;

  @Column({ name: 'cliente_id', type: 'int' })
  clienteId!: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente?: Cliente;

  @Column({ name: 'produto', type: 'varchar', length: 255 })
  produto!: string;

  @Column({ name: 'quantidade_sacas', type: 'int' })
  quantidadeSacas!: number;

  @Column({ name: 'preco_medio', type: 'decimal', precision: 12, scale: 2 })
  precoMedio!: string;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status!: string;

  @Column({ name: 'data_venda', type: 'date' })
  dataVenda!: Date;

  @Column({ name: 'observacoes', type: 'text', nullable: true })
  observacoes!: string | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
