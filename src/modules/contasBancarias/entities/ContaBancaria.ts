import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TipoContaBancaria } from '../../../ENUMS/tipoContaBancaria';
import { TipoChavePix } from '../../../ENUMS/tipoChavePix';
import { Cliente } from '../../clientes/entities/Cliente';
import { Banco } from '../../bancos/entities/Banco';

@Entity('contas_bancarias')
export class ContaBancaria {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'cliente_id', type: 'integer' })
  clienteId!: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente!: Cliente;

  @Column({ name: 'banco_id', type: 'integer' })
  bancoId!: number;

  @ManyToOne(() => Banco)
  @JoinColumn({ name: 'banco_id' })
  banco!: Banco;

  @Column({ name: 'agencia', type: 'varchar', length: 20 })
  agencia!: string;

  @Column({ name: 'numero_conta', type: 'varchar', length: 30 })
  numeroConta!: string;

  @Column({ name: 'digito_conta', type: 'varchar', length: 5, nullable: true })
  digitoConta!: string | null;

  @Column({
    name: 'tipo_conta',
    type: 'enum',
    enum: TipoContaBancaria,
    enumName: 'TIPO_CONTA_BANCARIA_ENUM',
    nullable: true,
  })
  tipoConta!: TipoContaBancaria | null;

  @Column({
    name: 'tipo_chave_pix',
    type: 'enum',
    enum: TipoChavePix,
    enumName: 'TIPO_CHAVE_PIX_ENUM',
    nullable: true,
  })
  tipoChavePix!: TipoChavePix | null;

  @Column({ name: 'chave_pix', type: 'varchar', length: 180, nullable: true })
  chavePix!: string | null;

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
