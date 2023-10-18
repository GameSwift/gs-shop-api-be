import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import fetch from 'node-fetch';
import { WalletsApiBalanceResponse } from './dtos/wallets.api.dto';
import { WalletsConfig } from './wallets.config';

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
        data?: {
            query?: Record<string, string>;
            bearer?: string;
            body?: object;
        },
    ): Promise<{
        status: number;
        json: T;
    }> {
        try {
            const url = this.generateUrl(path, data?.query);
            const headers = new Headers();

            if (data?.body) {
                headers.set('content-type', 'application/json');
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

            const response = await fetch(url, {
                headers,
                method: data.body ? 'POST' : 'GET',
                body: data.body ? JSON.stringify(data.body) : undefined,
            });

            const jsonResponse = await response.json();
            return { status: response.status, json: jsonResponse as T };
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

    async spend(bearer: string, amount: number, orderId: string, note: string) {
        const body = {
            tokenSymbol: this.walletsConfig.defaultTokenSymbol,
            amount,
            orderId,
            note,
        };

        const response = await this.request<Array<WalletsApiBalanceResponse>>(
            '/api/v1/user/order',
            { bearer, body },
        );

        if (response.status === 400) {
            throw new BadRequestException(
                (response.json as unknown as { message: string }).message,
            );
        }

        if (response.status !== 201) {
            this.logger.warn(
                'Invalid response from partner api',
                response.status,
                response.json,
            );
            throw new Error('Invalid response from partner api');
        }

        return response.json;
    }
}
