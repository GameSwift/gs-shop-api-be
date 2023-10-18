import { Schema, SchemaObj } from 'convict';

export interface OauthConfig {
    clientId: string;
    clientSecret: string;
    server: string;
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
        doc: 'GameSwift ID Oauth server',
        default: 'https://id.gameswift.io/api/oauth',
    } as SchemaObj<string>,

    gsAuthentication: {
        doc: 'GS ID Authentication header',
        format: String,
        default: '',
        env: 'GSID_AUTHENTICATION',
        sensitive: true,
    } as SchemaObj<string>,
};
