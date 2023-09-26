import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { OauthToken } from './entities/oauth.token.entity';
import { ExternalTokenInfoData, OauthApiService } from './oauth.api.service';
import { OauthConfig } from './oauth.config';
import { GSIDSystemRole } from './oauth.enum';

// TODO this is mock only
@Injectable()
export class OauthApiSpecService {
    constructor(
        @Inject('OauthConfig')
        private readonly oauthConfig: OauthConfig,
        @InjectRepository(OauthToken)
        private readonly oauthTokenRepository: Repository<OauthToken>,
        private readonly usersService: UsersService,
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

    async request(
        path: string,
        data: { query?: Record<string, string> },
    ): ReturnType<OauthApiService['request']> {
        // console.info(
        //     'Mocking request',
        //     this.generateUrl(path, data.query),
        //     data,
        // );

        if (path === 'token-info') {
            const response: ExternalTokenInfoData = {
                accessTokenExpiresAt: '2024-01-01T15:21:33Z',
                refreshTokenExpiresAt: '2024-02-01T15:21:33Z',
                scope: [],
                userId: '3e2145ab-f3f5-4ea6-a73b-ccb64338d10a',
                clientId: 'cd3a4b63-c814-4610-8b4b-6a1d606e5f8d',
                roles: [GSIDSystemRole.User],
                branches: ['a'],
                nickname: 'gamer',
                email: 'gamer@gmail.com',
                avatarUrl: 'url',
                country: 'PL',
                isTokenValid: true,
            };
            switch (data.query?.token) {
                case 'valid-token':
                    return { status: 200, json: response };
                case 'admin-token':
                    response.roles = [
                        GSIDSystemRole.User,
                        GSIDSystemRole.Admin,
                    ];
                    return { status: 200, json: response };
                case 'expired-token':
                    response.accessTokenExpiresAt = '2023-01-01T15:21:33Z';
                    response.refreshTokenExpiresAt = '2023-02-02T15:21:33Z';
                    return { status: 200, json: response };
                case 'parallel-token':
                    response.isTokenValid = false;
                    response.errorMessage = 'parallel_session_not_allowed';
                    return { status: 200, json: response };
                case 'invalid-token':
                default:
                    if (data.query?.token.startsWith('valid')) {
                        const user = await this.usersService.findOneById(
                            data.query.token.slice(6),
                        );
                        if (!user) {
                            throw new Error(
                                'cannot generate response, user does not exist',
                            );
                        }
                        response.accessTokenExpiresAt = '2024-01-01T15:21:33Z';
                        response.refreshTokenExpiresAt = '2024-02-01T15:21:33Z';
                        response.email = user.email;
                        response.nickname = user.nickname;
                        response.userId = user.id;
                        return { status: 200, json: response };
                    }
                    return { status: 404, json: {} };
            }
        }

        return { status: 404, json: {} };
    }
}
