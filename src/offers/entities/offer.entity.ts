import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Offer extends BaseEntity {
    @Column()
    price: number;

    @Column()
    description: string;

    @OneToMany(() => Order, (order) => order.offer)
    orders: Order[];
}
