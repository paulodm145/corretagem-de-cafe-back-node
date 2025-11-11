import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Tenant } from '../modules/tenants/entities/Tenant';

config(); // lê .env

export const MasterDataSource = new DataSource({
  type: 'postgres',
  host: process.env.CORE_DB_HOST || 'localhost',
  port: Number(process.env.CORE_DB_PORT || 5432),
  username: process.env.CORE_DB_USER || 'postgres',
  password: process.env.CORE_DB_PASS || 'postgres',
  database: process.env.CORE_DB_NAME || 'core',
  synchronize: false, // use migrations
  logging: false,
  entities: [Tenant],
  migrations: [__dirname + '/../database/core-migrations/*.{ts,js}'],
});
