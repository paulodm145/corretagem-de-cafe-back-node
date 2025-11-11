import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name!: string;

    @Column({ name: 'razao_social', type: 'varchar', length: 150 })
    razaoSocial!: string;

    @Column({ name: 'nome_fantasia', type: 'varchar', length: 150 })
    nomeFantasia!: string;

    @Column({ name: 'cnpj', type: 'varchar', length: 14, unique: true })
    cnpj!: string;

    @Column({ name: 'inscricao_estadual', type: 'varchar', length: 20, nullable: true })
    inscricaoEstadual!: string | null;

    @Column({ name: 'email_contato', type: 'varchar', length: 150, nullable: true })
    emailContato!: string | null;

    @Column({ name: 'telefone_contato', type: 'varchar', length: 20, nullable: true })
    telefoneContato!: string | null;

    @Column({ name: 'cliente_id', type: 'int' })
    clienteId!: number;

    @Column({ name: 'dbName', type: 'varchar', length: 100 })
    dbName!: string;

    @Column({ name: 'dbHost', type: 'varchar', length: 100, nullable: true })
    dbHost!: string;

    @Column({ name: 'dbPort', type: 'int', nullable: true })
    dbPort!: number;

    @Column({ name: 'dbUsername', type: 'varchar', length: 100, nullable: true })
    dbUsername!: string;

    @Column({ name: 'dbPassword', type: 'varchar', length: 100, nullable: true })
    dbPassword!: string;

    @Column({ name: 'dbSsl', type: 'boolean', default: false })
    dbSsl!: boolean;

    @Column({ name: 'status', type: 'boolean', default: true })
    isActive!: boolean;

    @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt!: Date;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt!: Date;

    @Column({
        type: 'uuid',
        default: () => 'uuid_generate_v4()', // ou 'gen_random_uuid()'
        nullable: false,
    })
    token!: string;

}