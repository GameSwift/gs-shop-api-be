import { Schema, SchemaObj } from 'convict';

export interface OauthConfig {
    clientId: string;
    clientSecret: string;
    server: string;
    cfAccessClientId?: string;
    cfAccessClientSecret?: string;
    gsAuthentication?: string;
}

export const oAuthConfigSchema: Schema<OauthConfig> = {
    clientId: {
        doc: 'GSID Oauth2 client id',
        default: 'id',
    } as SchemaObj<string>,

    clientSecret: {
        doc: 'GSID Oauth2 client secret',
        default: 'secret',
    } as SchemaObj<string>,

    server: {
        doc: 'GSID Oauth2 server',
        default: 'http://localhost:3000/api/oauth',
    } as SchemaObj<string>,

    cfAccessClientId: {
        doc: 'CF Access client id',
        format: String,
        default: '',
        env: 'GSID_CF_ACCESS_CLIENT_ID',
        sensitive: true,
    } as SchemaObj<string>,

    cfAccessClientSecret: {
        doc: 'CF Access client secret',
        format: String,
        default: '',
        env: 'GSID_CF_ACCESS_CLIENT_SECRET',
        sensitive: true,
    } as SchemaObj<string>,

    gsAuthentication: {
        doc: 'GS ID Authentication header',
        format: String,
        default: '',
        env: 'GSID_AUTHENTICATION',
        sensitive: true,
    } as SchemaObj<string>,
};
