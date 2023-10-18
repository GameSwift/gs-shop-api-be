import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';
import { WalletsModule } from '../wallets/wallets.module';
import { OrdersModule } from '../orders/orders.module';
import { ItemsModule } from '../items/items.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Offer]),
        WalletsModule,
        OrdersModule,
        ItemsModule,
    ],
    controllers: [OffersController],
    providers: [OffersService],
    exports: [OffersService],
})
export class OffersModule {}
