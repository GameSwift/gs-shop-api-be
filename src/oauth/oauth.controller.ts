import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CurrentUser, ICurrentUser } from './decorators/current.user.decorator';
import { UseOauthGuard } from './decorators/oauth.guard.decorator';
import { OauthGetMeResponse } from './dtos/oauth.response';
import { OauthService } from './oauth.service';

@Controller('oauth')
@ApiTags('oauth')
export class OauthController {
    constructor(
        private readonly oauthService: OauthService,
        private readonly usersService: UsersService,
    ) {}

    @Get('me')
    @UseOauthGuard()
    @ApiOperation({ summary: 'Returns logged user data' })
    @ApiOkResponse({
        type: OauthGetMeResponse,
        description: 'Returns logged user data',
    })
    async getMe(
        @CurrentUser() currentUser?: ICurrentUser,
    ): Promise<OauthGetMeResponse> {
        if (!currentUser) {
            throw new UnauthorizedException('User is not authorized');
        }
        const user = await this.usersService.findOneById(currentUser.id, true);

        if (!user) {
            throw new UnauthorizedException('Logged user is invalid');
        }

        return new OauthGetMeResponse(user);
    }
}
