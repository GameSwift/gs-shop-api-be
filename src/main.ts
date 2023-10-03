import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from './app.module';
import { AppConfig } from './config/config.module';

async function bootstrap() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const metadata = require(process.cwd() + '/package.json');
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    app.setGlobalPrefix('api');
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const appConfig: AppConfig = app.get('AppConfig');
    const config = new DocumentBuilder()
        .setTitle(metadata.name)
        .setDescription('GameSwift Shop API - env: ' + appConfig.environment)
        .setVersion(metadata.version)
        .addServer(appConfig.baseUrl)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
    SwaggerModule.setup('swagger', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });

    const port = process.env.PORT || 3005;
    console.log('port', port);
    await app.listen(port);
}
bootstrap();
