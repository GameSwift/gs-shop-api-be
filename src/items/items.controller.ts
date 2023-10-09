import { Controller, Get } from '@nestjs/common';
import { UseOauthGuard } from '../oauth/decorators/oauth.guard.decorator';
import {
    CurrentUser,
    ICurrentUser,
} from '../oauth/decorators/current.user.decorator';
import { ItemsService } from './items.service';
import { ItemsGetOwnedItemsResponse } from './dtos/items.response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('items')
@ApiTags('items')
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) {}

    @UseOauthGuard()
    @ApiResponse({
        type: ItemsGetOwnedItemsResponse,
    })
    @Get('owned')
    async getOwnedItems(@CurrentUser() user: ICurrentUser) {
        return new ItemsGetOwnedItemsResponse(
            await this.itemsService.getOwnedItems(user.id),
        );
    }
}
