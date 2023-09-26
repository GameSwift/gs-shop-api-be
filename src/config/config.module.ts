import { Module, Provider } from '@nestjs/common';
import * as convict from 'convict';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { memoize } from 'lodash';
import * as path from 'path';
import {
    DatabaseConfig,
    databaseConfigSchema,
} from '../database/database.config';
import { OauthConfig, oAuthConfigSchema } from '../oauth/oauth.config';
import { Environment } from './config.enum';
import {
    AsyncFactoryProvider,
    propertyOfProvider,
} from '../utils/dependency.injection';

interface EnvConfig {
    baseUrl: string;
    environment: Environment;
    port: number;
}

let envPath = '';
while (
    !fs.existsSync(path.join(envPath, '.env')) &&
    path.resolve(envPath) !== '/'
) {
    envPath = path.join('..', envPath);
}
// tslint:disable-next-line:no-var-requires
dotenv.config({ path: path.join(envPath, '.env') });

export type AppConfig = EnvConfig & {
    oauth: OauthConfig;
    database: DatabaseConfig;
};

const configSchema = convict<AppConfig>({
    oauth: oAuthConfigSchema,
    database: databaseConfigSchema,
    baseUrl: {
        default: 'http://localhost:3000/',
        doc: 'Application base url.',
        env: 'BASE_URL',
        format: String,
    },
    environment: {
        default: Environment.Development,
        doc: 'Application environment.',
        env: 'ENVIRONMENT',
        format: Object.values(Environment),
    },
    port: {
        default: 3001,
        doc: 'Listen port.',
        env: 'PORT',
        format: 'port',
    },
});

export const loadConfig: () => AppConfig = memoize(() => {
    const env: string = configSchema.get('environment').toLowerCase();

    const defaultConfig = path.join(process.cwd(), 'config', 'default.json');
    const envConfig = path.join(process.cwd(), 'config', `${env}.json`);
    const files = [defaultConfig, envConfig].filter((configPath) => {
        const exists = fs.existsSync(configPath);
        if (!exists) {
            // eslint-disable-next-line no-console
            console.info(`Config file ${configPath} does not exist`);
        }
        return exists;
    });

    configSchema.loadFile(files);
    configSchema.validate({
        allowed: 'strict',
    });
    return configSchema.getProperties();
});

const appConfigProvider: AsyncFactoryProvider<AppConfig> = {
    provide: 'AppConfig',
    useFactory: () => loadConfig(),
};

const oauthConfigProvider = propertyOfProvider(
    appConfigProvider,
    'oauth',
    'OauthConfig',
);

const databaseConfigProvider = propertyOfProvider(
    appConfigProvider,
    'database',
    'DatabaseConfig',
);

const providers: Provider[] = [
    appConfigProvider,
    oauthConfigProvider,
    databaseConfigProvider,
];

// @Global() // if we don't have to import config module everywhere
@Module({
    providers,
    exports: providers,
})
export class ConfigModule {}
