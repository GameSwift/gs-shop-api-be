import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { encryptSHA256 } from '../utils/crypto.helpers';
import { OauthErrorCode } from '../utils/error.codes';
import { OauthToken } from './entities/oauth.token.entity';
import { ExternalTokenInfoData, OauthApiService } from './oauth.api.service';

@Injectable()
export class OauthService {
    private readonly logger = new Logger(OauthService.name);

    constructor(
        @InjectRepository(OauthToken)
        private readonly oauthTokenRepository: Repository<OauthToken>,
        private readonly usersService: UsersService,
        private readonly oauthApiService: OauthApiService,
    ) {}

    async getAccessTokenData(
        accessToken: string,
    ): Promise<ExternalTokenInfoData | null> {
        if (accessToken.toLocaleLowerCase().includes('bearer ')) {
            accessToken = accessToken.slice(7);
        }

        try {
            const response =
                await this.oauthApiService.request<ExternalTokenInfoData>(
                    'token-info',
                    {
                        query: { token: accessToken },
                    },
                );

            if (response.status === 404) {
                throw new Error(OauthErrorCode.InvalidToken);
            }

            if (!response.json.userId) {
                this.logger.warn('Invalid Oauth data', response.json);
                throw new Error('Oauth server did not return valid data');
            }

            return response.json;
        } catch (e) {
            throw e;
        }
    }

    async isAccessTokenValid(
        accessToken: string,
    ): Promise<
        | { valid: false; reason?: string }
        | { valid: true; tokenData: ExternalTokenInfoData; userId: string }
    >;
    async isAccessTokenValid(
        accessToken: string,
    ): Promise<
        | { valid: boolean; reason?: string }
        | { valid: true; tokenData: ExternalTokenInfoData; userId: string }
    > {
        if (!accessToken) {
            return { valid: false, reason: OauthErrorCode.MissingAccessToken };
        }

        try {
            const tokenData = await this.getAccessTokenData(accessToken);
            if (!tokenData) {
                return { valid: false, reason: OauthErrorCode.InvalidToken };
            }

            if (+new Date(tokenData.accessTokenExpiresAt) < Date.now()) {
                return { valid: false, reason: OauthErrorCode.ExpiredToken };
            }

            if (tokenData.isTokenValid === false) {
                switch (tokenData.errorMessage) {
                    case 'parallel_session_not_allowed':
                        return {
                            valid: false,
                            reason: OauthErrorCode.ParallelSessionNotAllowed,
                        };
                    default:
                        return {
                            valid: false,
                            reason: OauthErrorCode.UnknownError,
                        };
                }
            }

            const oauthToken = await this.updateTokenAndUser(
                accessToken,
                tokenData,
            );

            return { valid: true, tokenData, userId: oauthToken.userId };
        } catch (e) {
            return { valid: false, reason: e.message };
        }
    }

    async saveTokenData(
        accessToken: string,
        user: User,
        tokenInfo: ExternalTokenInfoData,
    ) {
        const existingOauthToken = await this.oauthTokenRepository.findOneBy({
            hashedAccessToken: encryptSHA256(accessToken, user.id),
        });

        if (existingOauthToken) {
            return existingOauthToken;
        }

        const oauthToken = this.oauthTokenRepository.create({
            userId: user.id,
            expireAt: tokenInfo.accessTokenExpiresAt,
        });
        oauthToken.accessToken = accessToken;

        return this.oauthTokenRepository.save(oauthToken);
    }

    private async updateTokenAndUser(
        accessToken: string,
        tokenData: ExternalTokenInfoData,
    ) {
        let user = await this.usersService.findOneByGSId(tokenData.userId);

        if (!user) {
            user = await this.usersService.initialize(tokenData);
        }

        if (!user) {
            throw new Error("Can't find or create user for oauth token");
        }

        await this.usersService.updateTokenData(user.id, tokenData);
        return this.saveTokenData(accessToken, user, tokenData);
    }
}
export { ExternalTokenInfoData };
