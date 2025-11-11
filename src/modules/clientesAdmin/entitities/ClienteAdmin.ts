import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Cidade } from 'src/modules/cidades/entities/Cidade';
import { Estado } from 'src/modules/estados/entities/Estado';

@Entity('clientes')
export class ClienteAdmin {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'nome_fantasia', type: 'varchar', length: 255 })
    nomeFantasia!: string;

    @Column({ name: 'razao_social', type: 'varchar', length: 255 })
    razaoSocial!: string;

    @Column({ name: 'cnpj', type: 'varchar', length: 14 })
    cnpj!: string;

    @Column({ name: 'endereco', type: 'varchar', length: 255 })
    endereco!: string;

    @Column({ name: 'complemento', type: 'varchar', length: 255, nullable: true })
    complemento!: string;

    @Column({ name: 'bairro', type: 'varchar', length: 100 })
    bairro!: string;

    @Column({ name: 'cidade_id', type: 'integer' })
    cidadeId!: number;

    @ManyToOne(() => Cidade)
    @JoinColumn({ name: 'cidade_id' })
    cidade!: Cidade;

    @Column({ name: 'estado_id', type: 'integer' })
    estadoId!: number;

    @ManyToOne(() => Estado)
    @JoinColumn({ name: 'estado_id' })
    estado!: Estado;

    @Column({ name: 'cep', type: 'varchar', length: 10 })
    cep!: string;

    @Column({ name: 'email', type: 'varchar', length: 100 })
    email!: string;

    @Column({ name: 'telefone', type: 'varchar', length: 15 })
    telefone!: string;

    @Column({ name: 'whatsapp', type: 'varchar', length: 15, nullable: true })
    whatsapp!: string;

    @Column({ name: 'inscricao_estadual', type: 'varchar', length: 20 })
    inscricaoEstadual!: string;

    @Column({ name: 'site', type: 'varchar', length: 100, nullable: true })
    site!: string;

    @Column({ name: 'logo', type: 'varchar', length: 255, nullable: true })
    logo!: string;

    @Column({ name: 'status', type: 'boolean' })
    status!: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;
    
}