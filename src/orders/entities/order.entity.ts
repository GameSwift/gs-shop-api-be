import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Order extends BaseEntity {
    @Column()
    userId: string;

    @Column()
    offerId: string;

    @ManyToOne(() => Offer, (offer) => offer.orders, { onDelete: 'CASCADE' })
    @JoinTable()
    offer: Offer;

    @Column()
    price: number;
}
