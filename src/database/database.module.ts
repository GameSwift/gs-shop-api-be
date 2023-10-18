import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join, resolve } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ConfigModule } from '../config/config.module';
import { DatabaseConfig } from './database.config';

const basePath = resolve(join(__dirname, '..'));
const entitiesDir = basePath + '/**/*.entity.[tj]s';

const staticTypeOrmOptions: Partial<PostgresConnectionOptions> = {
    type: 'postgres',
    entities: [entitiesDir],
    migrations: [basePath + '/database/migrations/*.[tj]s'],
    synchronize: false,
};

const TypeOrmCoreModule = TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: ['DatabaseConfig'],
    useFactory(databaseConfig: DatabaseConfig): TypeOrmModuleOptions {
        return {
            ...staticTypeOrmOptions,
            ...databaseConfig,
        };
    },
});

@Module({
    imports: [TypeOrmCoreModule],
})
export class DatabaseModule {}
