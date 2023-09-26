import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { ICurrentUser } from '../decorators/current.user.decorator';
import { OauthService } from '../oauth.service';
import { Request } from 'express';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, 'oauth') {
    static key = 'oauth';

    constructor(private readonly oauthService: OauthService) {
        super();
    }

    async validate(req: Request): Promise<ICurrentUser> {
        const token = req.headers['authorization'];

        if (!token) {
            throw new UnauthorizedException();
        }

        const [, extractedToken] = token.split(' ');
        const result =
            await this.oauthService.isAccessTokenValid(extractedToken);

        if (result.valid === true) {
            return { id: result.userId, tokenData: result.tokenData };
        }

        throw new UnauthorizedException(result.reason);
    }
}
