import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { OffersFindAllResponse } from './dtos/offers.response';
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

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.offersService.findOne(+id);
    }
}
