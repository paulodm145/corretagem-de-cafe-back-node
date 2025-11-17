import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ContaBancaria } from '../../contasBancarias/entities/ContaBancaria';

@Entity('bancos')
export class Banco {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', nullable: true })
  codigo!: number | null;

  @Column({ type: 'varchar', length: 20, unique: true })
  ispb!: string;

  @Column({ type: 'varchar', length: 150 })
  nome!: string;

  @Column({ name: 'nome_completo', type: 'varchar', length: 255 })
  nomeCompleto!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => ContaBancaria, (conta) => conta.banco)
  contas?: ContaBancaria[];
}
