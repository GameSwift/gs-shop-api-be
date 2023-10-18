import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { UsersModule } from '../users/users.module';
import { OauthToken } from './entities/oauth.token.entity';
import { OauthApiService } from './oauth.api.service';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OauthStrategy } from './strategies/oauth.strategy';

@Global()
@Module({
    imports: [
        ConfigModule,
        UsersModule,
        TypeOrmModule.forFeature([OauthToken]),
    ],
    controllers: [OauthController],
    providers: [OauthService, OauthApiService, OauthStrategy],
})
export class OauthModule {}
