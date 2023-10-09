import { Injectable, Logger } from '@nestjs/common';
import { WalletsApiService } from './wallets.api.service';

@Injectable()
export class WalletsService {
    private readonly logger = new Logger(WalletsService.name);

    constructor(private readonly walletsApiService: WalletsApiService) {}

    async spend(bearer: string, orderId: string, price: number) {
        await this.walletsApiService.spend(
            bearer,
            price,
            orderId,
            `Order: ${orderId}`,
        );
    }
}
