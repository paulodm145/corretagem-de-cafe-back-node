import { Estado } from 'src/modules/estados/entities/Estado';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';

@Entity('cidades')
export class Cidade {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({ name: 'estado_id', type: 'integer' })
  estadoId!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Estado, (e) => e.cidades)
  @JoinColumn({ name: 'estado_id' })
  estado!: Estado;
}