import { Cidade } from 'src/modules/cidades/entities/Cidade';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('estados')
export class Estado {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({name: 'sigla', type: 'varchar', length: 2 })
  sigla!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Cidade, (c) => c.estado)
  cidades!: Cidade[];
}