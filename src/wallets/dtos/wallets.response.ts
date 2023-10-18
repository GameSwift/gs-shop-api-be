import { ApiProperty } from '@nestjs/swagger';
import { WalletsApiBalanceResponse } from './wallets.api.dto';

export class WalletsGetBalanceResponse {
    @ApiProperty({
        type: [WalletsApiBalanceResponse],
    })
    balances: Array<WalletsApiBalanceResponse>;

    constructor(balances: Array<WalletsApiBalanceResponse>) {
        this.balances = balances;
    }
}
