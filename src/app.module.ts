import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { OauthModule } from './oauth/oauth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { WalletsModule } from './wallets/wallets.module';
import { WalletsApiService } from './wallets/wallets.api.service';
import { ItemsModule } from './items/items.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        ConfigModule,
        DatabaseModule,
        ItemsModule,
        OauthModule,
        OffersModule,
        OrdersModule,
        UsersModule,
        WalletsModule,
    ],
    controllers: [AppController],
    providers: [AppService, WalletsApiService],
})
export class AppModule {}
