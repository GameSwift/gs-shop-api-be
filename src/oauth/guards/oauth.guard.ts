import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OauthStrategy } from '../strategies/oauth.strategy';

@Injectable()
export class OauthGuard extends AuthGuard(OauthStrategy.key) {}
