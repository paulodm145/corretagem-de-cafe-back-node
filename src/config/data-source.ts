import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config(); // carrega .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false, // usamos migrations
  logging: false,
  entities: [__dirname + '/../modules/**/entities/*.{ts,js}'],
  migrations: [__dirname + '/../database/tenant-migrations/*.{ts,js}'],
  migrationsTableName: 'tenant_migrations',
});

