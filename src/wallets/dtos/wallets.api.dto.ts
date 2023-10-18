import { ApiProperty } from '@nestjs/swagger';

class TokenResponse {
    @ApiProperty()
    symbol: string;

    @ApiProperty({
        description: 'URL of the token icon',
    })
    icon: string;
}

export class WalletsApiBalanceResponse {
    @ApiProperty()
    balance: number;

    @ApiProperty({
        type: TokenResponse,
    })
    token: TokenResponse;
}
