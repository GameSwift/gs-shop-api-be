import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { OauthConfig } from './oauth.config';

export interface ExternalTokenInfoData {
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    scope: Array<string>;
    userId: string;
    clientId: string;
    roles: Array<string>;
    branches: Array<string>;
    nickname: string;
    email: string;
    avatarUrl: string | null;
    country: string;
    isTokenValid: boolean;
    errorMessage?: 'parallel_session_not_allowed';
}

@Injectable()
export class OauthApiService {
    private readonly logger = new Logger(OauthApiService.name);

    constructor(
        @Inject('OauthConfig')
        private readonly oauthConfig: OauthConfig,
    ) {}

    get baseUrl() {
        return this.oauthConfig.server;
    }

    private generateUrl(path: string, query?: Record<string, string>): string {
        const url = new URL(
            path,
            this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/',
        );

        if (query) {
            for (const key in query) {
                url.searchParams.set(key, query[key]);
            }
        }

        return url.toString();
    }

    async request<T = unknown>(
        path: string,
        data: { query?: Record<string, string> },
    ): Promise<{
        status: number;
        json: T;
    }> {
        try {
            const url = this.generateUrl(path, data.query);
            const options: RequestInit =
                this.oauthConfig.cfAccessClientId &&
                this.oauthConfig.cfAccessClientSecret
                    ? {
                          headers: {
                              'CF-Access-Client-Id':
                                  this.oauthConfig.cfAccessClientId,
                              'CF-Access-Client-Secret':
                                  this.oauthConfig.cfAccessClientSecret,
                          },
                      }
                    : {};

            if (this.oauthConfig.gsAuthentication) {
                options.headers = {
                    ...options.headers,
                    'GS-Authentication': this.oauthConfig.gsAuthentication,
                };
            }

            const response = await fetch(url, options);

            const jsonResponse = await response.json();
            return { status: response.status, json: jsonResponse as T };
        } catch (e) {
            this.logger.error('Oauth error: ', e);
            if (e.code === 'ECONNREFUSED') {
                throw new InternalServerErrorException(
                    'Cannot connect to the Oauth server',
                );
            }
            throw e;
        }
    }
}
