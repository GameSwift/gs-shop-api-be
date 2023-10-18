import { join, resolve } from 'path';
import { DataSource } from 'typeorm';
import { loadConfig } from '../config/config.module';

const basePath = resolve(join(__dirname, '..', '..'));

const config = loadConfig();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    entities: [basePath + '/src/**/*.entity.{ts,js}'],
});

export default AppDataSource;
