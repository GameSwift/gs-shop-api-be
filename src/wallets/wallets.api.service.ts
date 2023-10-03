import {
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { WalletsConfig } from './wallets.config';
import { WalletsApiBalanceResponse } from './dtos/wallets.api.dto';

@Injectable()
export class WalletsApiService {
    private readonly logger = new Logger(WalletsApiService.name);

    constructor(
        @Inject('WalletsConfig')
        private readonly walletsConfig: WalletsConfig,
    ) {}

    get baseUrl() {
        return this.walletsConfig.baseUrl;
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

    private async request<T = unknown>(
        path: string,
        data?: { query?: Record<string, string>; bearer?: string },
    ): Promise<{
        status: number;
        json: T;
    }> {
        try {
            const url = this.generateUrl(path, data?.query);
            const headers = new Headers();

            if (this.walletsConfig.cfAccessClientId) {
                headers.set(
                    'CF-Access-Client-Id',
                    this.walletsConfig.cfAccessClientId,
                );
                headers.set(
                    'CF-Access-Client-Secret',
                    this.walletsConfig.cfAccessClientSecret,
                );
            }

            if (data?.bearer) {
                headers.set('authorization', 'bearer ' + data.bearer);

                this.logger.verbose(
                    `Calling '${url}',' using token '${
                        data.bearer.substring(0, 5) +
                        '...' +
                        data.bearer.substring(data.bearer.length - 5)
                    }'`,
                );
            } else {
                this.logger.verbose(`Calling '${url}',' without token`);
            }

            const response = await fetch(url, { headers: headers });
            const jsonResponse = await response.json();
            return { status: response.status, json: jsonResponse };
        } catch (e) {
            this.logger.error('Partner API Error: ', e);
            if (e.code === 'ECONNREFUSED') {
                throw new InternalServerErrorException(
                    'Cannot connect to the partner api',
                );
            }
            throw e;
        }
    }

    async getBalance(
        bearer: string,
    ): Promise<Array<WalletsApiBalanceResponse>> {
        const response = await this.request<Array<WalletsApiBalanceResponse>>(
            '/api/v1/user/balance',
            { bearer },
        );

        return response.json;
    }
}
