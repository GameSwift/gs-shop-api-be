import { ApiProperty } from '@nestjs/swagger';
import { Offer } from '../entities/offer.entity';
import { Order } from '../../orders/entities/order.entity';

class OfferResponse {
    @ApiProperty()
    id: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    constructor(offer: Offer) {
        this.id = offer.id;
        this.description = offer.description;
        this.price = offer.price;
    }
}

export class OffersFindAllResponse {
    @ApiProperty({
        type: [OfferResponse],
    })
    offers: Array<OfferResponse>;

    constructor(offers: Array<Offer>) {
        this.offers = offers.map((offer) => new OfferResponse(offer));
    }
}

export class OffersPurchaseResponse {
    @ApiProperty()
    orderId: string;

    constructor({ id }: Order) {
        this.orderId = id;
    }
}
