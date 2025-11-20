import 'reflect-metadata';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('dados_empresa')
export class DadosEmpresa {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'cnpj', type: 'varchar', length: 14, unique: true })
  cnpj!: string;

  @Column({ name: 'logo_base64', type: 'text' })
  logoBase64!: string;

  @Column({ name: 'email', type: 'varchar', length: 180 })
  email!: string;

  @Column({ name: 'telefone', type: 'varchar', length: 20 })
  telefone!: string;

  @Column({ name: 'endereco', type: 'varchar', length: 255 })
  endereco!: string;

  @Column({ name: 'site', type: 'varchar', length: 200, nullable: true })
  site!: string | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
