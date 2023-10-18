import { Schema, SchemaObj } from 'convict';

export interface WalletsConfig {
    baseUrl: string;
    clientId: string;
    defaultTokenSymbol: string;
}

export const walletsConfigSchema: Schema<WalletsConfig> = {
    baseUrl: {
        doc: 'Partner API url',
        default: 'https://pay-partner.gameswift.io/',
        env: 'WALLET_PARTNER_BASE_URL',
    } as SchemaObj<string>,

    clientId: {
        doc: 'GameSwift OAuth Client ID that is registered in GS Pay API',
        default: '',
        env: 'WALLET_PARTNER_CLIENT_ID',
    } as SchemaObj<string>,

    defaultTokenSymbol: {
        doc: 'Default token symbol',
        default: 'GSWIFT',
        env: 'WALLET_DEFAULT_TOKEN_SYMBOL',
    } as SchemaObj<string>,
};
