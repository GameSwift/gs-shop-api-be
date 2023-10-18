import { Schema, SchemaObj } from 'convict';

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string | undefined;
    database: string;
}

export const databaseConfigSchema: Schema<DatabaseConfig> = {
    host: {
        doc: 'Database hostname',
        default: 'localhost',
        env: 'POSTGRES_HOST',
    } as SchemaObj<string>,

    database: {
        doc: 'Database name',
        default: 'gsshop',
        env: 'POSTGRES_NAME',
    } as SchemaObj<string>,

    port: {
        doc: 'Database port',
        default: 5432,
        env: 'POSTGRES_PORT',
    } as SchemaObj<number>,

    username: {
        doc: 'Database username',
        default: 'web',
        env: 'POSTGRES_USER',
        format(value: string | undefined) {
            if (!value) {
                throw new Error('cannot be empty');
            }
        },
    } as SchemaObj<string>,

    password: {
        doc: 'Database password',
        default: '',
        sensitive: true,
        env: 'POSTGRES_PASSWORD',
    } as SchemaObj<string | undefined>,
};
