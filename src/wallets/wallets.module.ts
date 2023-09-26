import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';

@Module({
    providers: [WalletsService],
})
export class WalletsModule {}
