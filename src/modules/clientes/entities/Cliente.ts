import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AtuacaoCliente } from '../../../ENUMS/atuacaoCliente';
import { TipoCompradorCliente } from '../../../ENUMS/tipoCompradorCliente';
import { TipoPessoaCliente } from '../../../ENUMS/tipoPessoaCliente';
import { LocalDescarga } from '../../locaisDescarga/entities/LocalDescarga';
import { ContaBancaria } from '../../contasBancarias/entities/ContaBancaria';
import { Estado } from '../../estados/entities/Estado';
import { Cidade } from '../../cidades/entities/Cidade';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'nome', type: 'varchar', length: 255 })
  nome!: string;

  @Column({
    name: 'tipo_pessoa',
    type: 'enum',
    enum: TipoPessoaCliente,
    enumName: 'TIPO_PESSOA_CLIENTE_ENUM',
  })
  tipoPessoa!: TipoPessoaCliente;

  @Column({ name: 'documento', type: 'varchar', length: 20, unique: true })
  documento!: string;

  @Column({ name: 'inscricao_estadual', type: 'varchar', length: 20, nullable: true })
  inscricaoEstadual!: string | null;

  @Column({
    name: 'tipo_comprador',
    type: 'enum',
    enum: TipoCompradorCliente,
    enumName: 'TIPO_COMPRADOR_CLIENTE_ENUM',
  })
  tipoComprador!: TipoCompradorCliente;

  @Column({
    name: 'atuacao',
    type: 'enum',
    enum: AtuacaoCliente,
    enumName: 'ATUACAO_CLIENTE_ENUM',
  })
  atuacao!: AtuacaoCliente;

  @Column({ name: 'data_nascimento', type: 'date' })
  dataNascimento!: Date;

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

  @Column({ name: 'estado_id', type: 'integer' })
  estadoId!: number;

  @Column({ name: 'cidade_id', type: 'integer' })
  cidadeId!: number;

  @Column({ name: 'email', type: 'varchar', length: 180, nullable: true })
  email!: string | null;

  @Column({ name: 'telefone', type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ name: 'observacao', type: 'text', nullable: true })
  observacao!: string | null;

  @Column({ name: 'numero_car', type: 'varchar', length: 30, nullable: true })
  numeroCar!: string | null;

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo!: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @OneToMany(() => LocalDescarga, (local) => local.cliente)
  locaisDescarga?: LocalDescarga[];

  @OneToMany(() => ContaBancaria, (conta) => conta.cliente)
  contasBancarias?: ContaBancaria[];

  @ManyToOne(() => Estado)
  @JoinColumn({ name: 'estado_id' })
  estado?: Estado;

  @ManyToOne(() => Cidade)
  @JoinColumn({ name: 'cidade_id' })
  cidade?: Cidade;
}
