import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from '../../clientes/entities/Cliente';

@Entity('locais_descarga')
export class LocalDescarga {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'cliente_id', type: 'integer' })
  clienteId!: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'cep', type: 'varchar', length: 8 })
  cep!: string;

  @Column({ name: 'endereco', type: 'varchar', length: 255 })
  endereco!: string;

  @Column({ name: 'numero', type: 'varchar', length: 20 })
  numero!: string;

  @Column({ name: 'complemento', type: 'varchar', length: 100, nullable: true })
  complemento!: string | null;

  @Column({ name: 'bairro', type: 'varchar', length: 120 })
  bairro!: string;

  @Column({ name: 'uf', type: 'char', length: 2 })
  uf!: string;

  @Column({ name: 'cidade', type: 'varchar', length: 120 })
  cidade!: string;

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
