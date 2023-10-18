import { Controller, Get } from '@nestjs/common';
import { WalletsGetBalanceResponse } from './dtos/wallets.response';
import { UseOauthGuard } from '../oauth/decorators/oauth.guard.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletsApiService } from './wallets.api.service';
import {
    CurrentUser,
    ICurrentUser,
} from '../oauth/decorators/current.user.decorator';

@Controller('wallets')
@ApiTags('wallets')
export class WalletsController {
    constructor(private readonly walletsApiService: WalletsApiService) {}

    @Get('balance')
    @ApiResponse({
        type: WalletsGetBalanceResponse,
    })
    @UseOauthGuard()
    async getBalance(
        @CurrentUser() user: ICurrentUser,
    ): Promise<WalletsGetBalanceResponse> {
        const balance = await this.walletsApiService.getBalance(user.bearer);
        return new WalletsGetBalanceResponse(balance);
    }
}
