import { Schema, SchemaObj } from 'convict';

export interface WalletsConfig {
    baseUrl: string;
    clientId: string;
    cfAccessClientId: string;
    cfAccessClientSecret: string;
}

export const walletsConfigSchema: Schema<WalletsConfig> = {
    baseUrl: {
        doc: 'Partner API url',
        default: 'https://dev-pay-partner.gameswift.io/',
        env: 'WALLET_PARTNER_BASE_URL',
    } as SchemaObj<string>,

    clientId: {
        doc: 'GameSwift ID client ID',
        default: '',
        env: 'WALLET_PARTNER_CLIENT_ID',
    } as SchemaObj<string>,

    cfAccessClientId: {
        doc: 'Cloudflare service access key',
        default: '',
        env: 'WALLET_CF_ACCESS_CLIENT_ID',
    } as SchemaObj<string>,

    cfAccessClientSecret: {
        doc: 'Cloudflare service secret key',
        default: '',
        env: 'WALLET_CF_ACCESS_CLIENT_SECRET',
    } as SchemaObj<string>,
};
