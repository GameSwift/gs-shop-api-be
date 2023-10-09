import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from '../offers/entities/offer.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
    ) {}

    async create(userId: string, offer: Offer) {
        const order = this.ordersRepository.create({
            userId: userId,
            offerId: offer.id,
            price: offer.price,
        });

        return this.ordersRepository.save(order);
    }

    findById(id: string) {
        return this.ordersRepository.findOneBy({ id: id });
    }
}
