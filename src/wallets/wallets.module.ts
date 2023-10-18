import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { WalletsApiService } from './wallets.api.service';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
    imports: [ConfigModule],
    providers: [WalletsService, WalletsApiService],
    controllers: [WalletsController],
    exports: [WalletsService],
})
export class WalletsModule {}
