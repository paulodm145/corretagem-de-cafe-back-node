import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', length: 100 })
    name!: string;

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

    dbSsl: boolean | undefined;

}