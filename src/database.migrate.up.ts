import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Connection } from 'typeorm';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [ConfigModule, DatabaseModule],
    exports: [],
})
export class AppModule {
    constructor(private readonly connection: Connection) {
        this.connection
            .runMigrations()
            .then((migrations) => {
                migrations.map((v) => console.info(v.name));
                console.info('done');
                process.exit();
            })
            .catch((err) => {
                console.error(err);
                process.exit(1);
            });
    }
}

async function bootstrap() {
    await NestFactory.create(AppModule, {});
}

bootstrap();
