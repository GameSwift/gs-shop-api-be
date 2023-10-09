import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Item } from '../../items/entities/item.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Offer extends BaseEntity {
    @Column()
    price: number;

    @Column()
    description: string;

    @OneToMany(() => Order, (order) => order.offer)
    orders: Order[];

    @OneToOne(() => Item)
    @JoinColumn()
    item: Item;

    @Column()
    itemId: string;
}
