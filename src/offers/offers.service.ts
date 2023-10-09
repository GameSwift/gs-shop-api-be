import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { ICurrentUser } from '../oauth/decorators/current.user.decorator';
import { WalletsService } from '../wallets/wallets.service';
import { OrdersService } from '../orders/orders.service';
import { ItemsService } from '../items/items.service';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer)
        private offersRepository: Repository<Offer>,
        private readonly walletsService: WalletsService,
        private readonly ordersService: OrdersService,
        private readonly itemsService: ItemsService,
    ) {}

    findAll() {
        return this.offersRepository.find();
    }

    findOne(id: string) {
        return this.offersRepository.findOneBy({ id: id });
    }

    remove(id: number) {
        return `This action removes a #${id} offer`;
    }

    async purchase(id: string, user: ICurrentUser) {
        const offer = await this.findOne(id);

        if (!offer) {
            throw new Error('Offer not found');
        }

        if (
            await this.itemsService.validateItemOwnership(user.id, offer.itemId)
        ) {
            throw new ConflictException('User already owns this item');
        }

        const order = await this.ordersService.create(user.id, offer);

        await this.walletsService.spend(user.bearer, order.id, order.price);
        await this.itemsService.assignToUser(user.id, offer.itemId);

        return order;
    }
}
