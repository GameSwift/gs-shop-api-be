import {
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import {
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import {
    CurrentUser,
    ICurrentUser,
} from '../oauth/decorators/current.user.decorator';
import { UseOauthGuard } from '../oauth/decorators/oauth.guard.decorator';
import {
    OffersFindAllResponse,
    OffersPurchaseResponse,
} from './dtos/offers.response';
import { OffersService } from './offers.service';

@Controller('offers')
@ApiTags('offers')
export class OffersController {
    constructor(private readonly offersService: OffersService) {}

    @Get()
    @ApiResponse({
        type: OffersFindAllResponse,
    })
    async findAll() {
        return new OffersFindAllResponse(await this.offersService.findAll());
    }

    @Post(':id/purchase')
    @UseOauthGuard()
    @ApiResponse({
        type: OffersPurchaseResponse,
    })
    @ApiNotFoundResponse({
        description: 'Offer not found',
    })
    @ApiForbiddenResponse({
        description:
            'User is not allowed to purchase this offer. Insufficient funds',
    })
    async purchase(@Param('id') id: string, @CurrentUser() user: ICurrentUser) {
        if (!(await this.offersService.findOne(id))) {
            throw new NotFoundException('Offer not found');
        }

        const order = await this.offersService.purchase(id, user);

        return new OffersPurchaseResponse(order);
    }
}
